const { NadeoAPI } = require('./interop/NadeoAPI');
const { NadeoAuth } = require('./interop/NadeoAuth');
const { DiscordClient } = require('./interop/discordClient');
const { ClubData, ClubMember } = require('./objects/ClubData');

const { Canvas, registerFont } = require('canvas');
const PNG = require('pngjs').PNG;

const fs = require('fs');
require('dotenv').config();

class App {
    constructor() {
        this.auth = null;
        this.api = null;
        this.client = null;
        this.clubData = null;
        this.cotdQueue = {};
    }

    async start() {

        this.auth = new NadeoAuth(process.env.UBI_USER, process.env.UBI_PASS);
        await this.auth.init();

        this.api = new NadeoAPI(this.auth);

        this.clubdata = new ClubData();
        await this.clubdata.loadFromFile();

        const date = new Date();
        console.log("starting at " + date.toLocaleString());

        const clubId = process.env.CLUB_ID;

        registerFont('resources/forkawesome-webfont.ttf', { family: 'Fork Awesome' });

        //discord client
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);
        while (!this.client.connected) {
            await new Promise(r => setTimeout(r, 100));
        }
        const channel = this.client.getChannelByName("bot");

        //register methods to receive messages and bind it to a OnDiscordMessage method
        this.client.registerMessageHandler(this.OnDiscordMessage.bind(this));

        //clear the channel
        await channel.bulkDelete(100);

        //club information
        // await this.UpdateClubData(clubId, channel);

        //map information
        const daysData = (await this.api.getTOTDData()).days;
        const lastDay = daysData[daysData.length - 1].map;

        const mapinfo = {
            mapUid: lastDay.mapUid,
            mapName: lastDay.name
        };

        var challenges = await this.api.getChallengeList(5, 0);

        // filter for challenges containting "COTD" in the name, only store name, startDate, and id
        challenges = challenges.filter(c => c.name.includes("COTD")).map(c => {
            const date = new Date();
            return {
                name: c.name,
                startDate: c.startDate,
                id: c.id
            };
        });

        //for each challenge in the future, add it to the queue
        for (const c of challenges) {
            const timeTill = c.startDate * 1000 - date;
            if (timeTill > 0) {
                this.cotdQueue[c.id] = c;
            }
        }

        console.log("COTD queue: " + JSON.stringify(this.cotdQueue));

        // const zay = "90dc7c06-3fad-42ad-b92e-a230efb8f088";

        while (false) {
            // const nextCOTD = await this.GetNextCotd(date);

            // console.log("next COTD: " + nextCOTD.name);
            // let timeTill = nextCOTD.startDate * 1000 - date;
            // let timeTillString = this.msToTime(timeTill);

            // const testing = true;
            // if (testing) {
            //     timeTill = 1000;
            //     timeTillString = this.msToTime(timeTill);
            // }

            // console.log("waiting for next COTD: " + timeTillString);
            // await new Promise(r => setTimeout(r, timeTill));
            // console.log("running scheduled COTD");


            // const s = c.toString().padStart(4, ' ');
            // console.log(`${s} | ${id} | ${member.tag} ${member.name}`)

            // build a collection of unique tags using a set
            const tags = new Set();
            for (const id in this.clubdata.members) {
                const member = this.clubdata.members[id];
                tags.add(member.tag);
            }

            console.log(tags);

            let c = 0;
            // for each unique tag, render a tag image and send it to discord
            for (const t of tags) {
                const tag = this.splitTextWithColor(t);

                const w = 512;
                const h = 80;
                const canvas = new Canvas(w, h)
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, w, h);
                ctx.font = '64px "Fork Awesome"';

                // draw tag
                let x = 0;
                for (let i = 0; i < tag.length; i++) {
                    const code = tag[i];
                    const text = tag[i + 1];
                    if (code.startsWith("$")) {
                        const color = code.substring(1, 4);
                        ctx.fillStyle = "#" + color;
                        ctx.fillText(text, x, 64);
                        x += ctx.measureText(text).width;
                        i++;
                    }
                }

                const testImage = ctx.canvas.toBuffer('image/png');
                this.client.sendImage(channel, testImage);

                c++;
                //stop after 10
                if (c > 10) {
                    break;
                }
            }

            break;
        }

    }

    OnDiscordMessage(message) {
        console.log("received message: " + message.content);
    }


    async UpdateClubData(clubId, channel) {
        await this.UpdateClubInfo(clubId, channel);
        await this.UpdateClubMemberInfo(clubId);
        fs.writeFileSync("cache/clubdata.json", JSON.stringify(this.clubdata, null, 2));
    }

    // split text into array of formatting blocks/color codes and text  
    // example inputs: 
    // $S$FFFCL$8CFO$4AFO$08FB
    // $S$FFFCL$8CFO$4AFO$08F
    // $17BX$479R$766T$B63R$E50V$<
    // example outputs:
    // [ '$FFF' , 'CL' , '$8CF' , 'O' , '$4AF' , 'O' , '$08F' , 'B' ]
    // [ '$FFF' , 'CL' , '$8CF' , 'O' , '$4AF' , 'O' , '$08F' ]
    // [ '$17B' , 'X' , '$479' , 'R' , '$766' , 'T' , '$B63' , 'R' , '$E50' , 'V' , '$<' ]
    splitTextWithColor(text) {
        // regex to match '$[oiwntslgzOIWNTSLGZ$]{1}' or '$[0-9a-fA-F]{3}' or any others
        const regex = /\$[oiwntslgzOIWNTSLGZ$]{1}|\$[0-9a-fA-F]{3}/g;
        const matches = text.matchAll(regex);
        const result = [];
        for (const match of matches) {
            const m = match[0];
            // starts with $ and is a length of 2
            if (m.startsWith('$') && m.length == 2) {
                continue;
            }
            result.push(m);
        }
        console.log(result);
        return result;
    }

    async GetNextCotd(date) {
        const challengeData = await this.api.getChallengeList();
        let nextCOTD = null;
        //reverse for
        for (let i = challengeData.length - 1; i >= 0; i--) {
            const challenge = challengeData[i];
            // if "COTD" is in the name
            if (challenge.name.indexOf("COTD") > -1) {
                const challengeDate = new Date(challenge.startDate * 1000);
                const timeTill = challengeDate - date;
                console.log(challenge.name + ' starts at ' + challengeDate.toLocaleString() + '. diff: ' + this.msToTime(timeTill));
                if (timeTill > 0 && nextCOTD == null) {
                    nextCOTD = challenge;
                }
            }
        }
        return nextCOTD;
    }

    // convert milliseconds to hh:mm:ss format, if time is negative include a - sign at the start
    msToTime(ms) {
        const sign = ms < 0 ? "-" : "";
        const seconds = Math.floor((Math.abs(ms) / 1000) % 60);
        const minutes = Math.floor((Math.abs(ms) / (1000 * 60)) % 60);
        const hours = Math.floor((Math.abs(ms) / (1000 * 60 * 60)));

        return sign + hours + ":" + minutes + ":" + seconds;
    }


    async UpdateClubMemberInfo(clubId) {
        const pageSize = 20;
        let count = null;
        let pages = 1;
        for (let i = 0; i < pages; i++) {
            const membersReq = await this.api.getMemberIdsFromClub(clubId, i * pageSize, pageSize);
            if (pages == 1) {
                count = membersReq.itemCount;
                pages = membersReq.maxPage;
            }

            const members = membersReq.clubMemberList;
            for (let i = 0; i < members.length; i++) {

                const members = membersReq.clubMemberList;
                //for each member, add to clubdata.members
                for (let i = 0; i < members.length; i++) {
                    const id = members[i].accountId;
                    const memberData = new ClubMember(id, null);
                    this.clubdata.members[id] = memberData;
                }
            }
        }

        //map with id : name from members list
        const memberIds = Object.keys(this.clubdata.members);
        for (let i = 0; i < memberIds.length; i += 20) {
            const ids = memberIds.slice(i, i + 20);
            const names = await this.api.getPlayerDisplayNames(ids);
            const tags = await this.api.getPlayerDisplayTags(ids);
            //doing names and tag separately because the api doesnt always return the same amount of data
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                this.clubdata.members[name.accountId].name = name.displayName;
            }
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                this.clubdata.members[tag.accountId].tag = tag.clubTag;
            }

        }
    }

    // update club info
    async UpdateClubInfo(clubId) {
        const clubReqData = await this.api.getClubData(clubId);

        this.clubdata.name = clubReqData.name;
        this.clubdata.tag = clubReqData.tag;
        this.clubdata.id = clubReqData.id;
    }

    

}

// export app
module.exports = [ App ];

