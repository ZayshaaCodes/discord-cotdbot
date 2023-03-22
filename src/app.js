const { NadeoAPI } = require('./interop/NadeoAPI');
const { NadeoAuth } = require('./interop/NadeoAuth');
const { DiscordClient } = require('./interop/discordClient');
const { ClubData, ClubMember } = require('./objects/ClubData');
const ScheduledTasks = require('./ScheduledTasks');


const { Canvas, registerFont } = require('canvas');
const PNG = require('pngjs').PNG;

const fs = require('fs');
require('dotenv').config();

class App {
    constructor() {
        this.auth = null;
        this.api = null;
        this.client = null;
        this.botChannel = null;
        this.currentMap = null;
        this.curCotd = null;
        this.clubData = null;
        this.cotdhours = [2, 10, 18];
        this.cotdtimes = this.cotdhours.map(h => new Date(new Date().setUTCHours(h)));
        this.scheduledTasks = new ScheduledTasks(); // for cron jobs
    }

    async init() {
        this.auth = new NadeoAuth();
        await this.auth.init();

        this.api = new NadeoAPI(this.auth);

        this.clubData = new ClubData();
        if (!(await this.clubData.loadFromFile()))
            this.UpdateClubData();


        const date = new Date();
        console.log("starting at " + date.toLocaleString());

        //canvas dings
        // registerFont('resources/forkawesome-webfont.ttf', { family: 'Fork Awesome' });


        //discord client
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);
        while (!this.client.connected) await new Promise(r => setTimeout(r, 100));
        this.botChannel = this.client.getChannelByName("bot");

        // --------------- COTD COMMAND ---------------
        this.client.registerNewCommand("cotd", "get current cotd", async (interaction) => {
            const cotd = await this.getMostRecentCOTD();
            const map = await this.getTodaysMap();
            interaction.reply("Map: " + App.tmSplit(map.map.name).plain + "\nchallenge id: " + cotd.recent.id);
        });

        // --------------- STANDING COMMAND ---------------
        this.client.registerNewCommand("standing", "get current cotd standings", async (interaction) => {
            let members = Object.keys(this.clubData.members);

            const msg = await interaction.reply("Fetching records...");

            const allStanding = [];
            for (let i = 0; i < members.length; i += 20) {
                // for (let i = 0; i < 10; i += 20) {
                let ids = members.slice(i, i + 20);
                // console.log(ids);
                let standing = await this.api.GetCurrentStandingForPlayers(ids, this.curCotd.recent.id, this.currentMap.mapUid);
                // console.log(standing);
                allStanding.push(...standing.records);

                // this.botChannel.send(standing);
            }

            // append player names to the records
            for (const record of allStanding) {
                record.playerName = this.clubData.members[record.player].name;
            }

            // sort by rank
            allStanding.sort((a, b) => a.rank - b.rank);
            console.log(allStanding);

            let print = ""
            for (const record of allStanding) {
                print += `${record.rank} - ${record.playerName} - ${this.msToTime(record.score)}\n`;
            }

            // console.log(standing);
            if (print.length == 0) print = "No records yet!";
            msg.edit(print);
            // interaction.reply(print);
            // this.botChannel.send(print);
        });

        this.curCotd = await this.getMostRecentCOTD();
        this.currentMap = await (await this.getTodaysMap()).map;

        console.log("current cotd: " + JSON.stringify(this.curCotd.recent, null, 2));
        console.log("current map: " + this.currentMap.name);

        if (false) {
            await this.UpdateClubData(39343);
        }
    }


    getNextCotdTime() {

        const next = this.cotdtimes.filter(t => t > new Date()); // get the next ones
        if (next.length == 0) { // if we are past all of them, get the next day's
            next = this.cotdtimes[0];
            next.setDate(next.getDate() + 1);
        }
        return next[0];
    }

    async start() {
        await this.init();

        const hrs = this.cotdhours.join(","); // just so i can test easier

        // const comps = await this.api.getCompetitionList();
        // console.log(comps);

        // const lb = await this.api.getCompetitionLeaderboard(5263);
        // console.log(lb);

        //     const competitionLeaderboardEndpoint =`https://competition.trackmania.nadeo.club/api/competitions/5263/leaderboard`;
        //    const r =  await this.api.makeAPIRequest(competitionLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        //    console.log(r);

        //    return;


        // --------------------- start of cotd ---------------------
        this.scheduledTasks.add("start", `1 ${hrs} * * *`, async () => { // 0th minute of the hour
            this.curCotd = await this.getMostRecentCOTD();
            if (this.curCotd.isNewMap) {
                this.currentMap = await (await this.getTodaysMap()).map;
            }

            this.botChannel.send(this.curCotd.recent.name + " starting!");
            this.botChannel.send("Map: " + App.tmSplit(this.currentMap.name).plain);
            this.botChannel.send("challenge id: " + this.curCotd.recent.uid);
        });

        // --------------------- cotd polling ---------------------
        this.scheduledTasks.add("poll", `16 ${hrs} * * *`, async () => { // every minute from 1 to 15

            let members = Object.keys(this.clubData.members);
            console.log(members.splice(0, 5));


            const allStanding = [];
            for (let i = 0; i < members.length; i += 20) {
                // for (let i = 0; i < 10; i += 20) {
                let ids = members.slice(i, i + 20);
                let standing = await this.api.GetCurrentStandingForPlayers(ids, this.curCotd.recent.id, this.currentMap.mapUid);
                allStanding.push(...standing.records);
                // this.botChannel.send(standing);
            }

            // append player names to the records
            for (const record of allStanding) {
                record.playerName = this.clubData.members[record.player].name;
            }

            // sort by rank
            allStanding.sort((a, b) => a.rank - b.rank);
            console.log(allStanding);

            let print = ""
            for (const record of allStanding) {
                print += `${record.rank} - ${record.playerName} - ${this.msToTime(record.score)}\n`;
            }

            // console.log(standing);
            if (print.length == 0) print = "No records yet!";
            this.botChannel.send(print);
        });

        // --------------------- end of cotd ---------------------
        this.scheduledTasks.add("end", `16 ${hrs} * * *`, async () => { // 16th minute of the hour
            this.botChannel.send("COTD qualifying is ending!");
        });

    }

    static tmSplit(input) {
        // Use regex to match Trackmania formatting characters
        const formattingRegex = /\$[OIWNTSGZLoiwntsgzl$]{1}|\$[0-9a-fA-F]{3}/g;
        const displayTextArray = input.split(formattingRegex);
        const formattingMatches = input.match(formattingRegex) || [];

        const arr = [];
        const displayedText = [];
        for (let i = 0; i < displayTextArray.length; i++) {
            if (formattingMatches[i]) arr.push(formattingMatches[i]);
            if (displayTextArray[i] != "") arr.push(displayTextArray[i]);
            if (displayTextArray[i] && !displayTextArray[i].startsWith("$")) displayedText.push(displayTextArray[i]);
        }
        const plain = displayedText.join("");
        return { input, arr, plain };
    }

    async getTodaysMap() {
        const daysData = (await this.api.getTOTDData()).days;
        const day = daysData[daysData.length - 1];
        const map = day.map;
        return { map, day: day.monthday };
    }

    async getMostRecentCOTD() {
        const challenges = (await this.api.getChallengeList(10, 0)).filter(c => c.name.includes("COTD"));
        let mostRecentCOTD = null;
        const currentTime = new Date();

        for (const c of challenges) {
            const startDate = new Date(c.startDate * 1000 - 1000 * 60 * 3);
            const diff = startDate.getTime() - currentTime.getTime();
            if (diff < 0) { // if the challenge has already started, it could be thes most recent
                return { recent: c, isNewMap: (/COTD.*#1/).test(c.name) };
            }
        }
    }



    getMemberById(id) {
        const member = this.clubData.members[id + ""];
        return member || null;
    }

    OnDiscordMessage(message) {
        console.log("received message: " + message.content);
    }

    // In your App class
    getData(key) {
        switch (key) {
            case 'clubData':
                return this.clubData;
            default:
                return null;
        }
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
        console.log("next COTD: " + nextCOTD.name);
        return nextCOTD;
    }

    // convert milliseconds to hh:mm:ss format, if time is negative include a - sign at the start
    msToTime(ms) {
        const sign = ms < 0 ? "-" : ""; // if time is negative include a - sign at the start
        const milliseconds = Math.floor(Math.abs(ms) % 1000);
        const seconds = Math.floor((Math.abs(ms) / 1000) % 60);
        const minutes = Math.floor((Math.abs(ms) / (1000 * 60)) % 60);
        const hours = Math.floor((Math.abs(ms) / (1000 * 60 * 60)));

        return sign + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    async UpdateClubData(clubId) {
        await this.UpdateClubInfo(clubId);
        await this.UpdateClubMemberInfo(clubId);
        fs.writeFileSync("cache/clubdata.json", JSON.stringify(this.clubData, null, 2));
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
                    this.clubData.members[id] = memberData;
                }
            }
        }

        //map with id : name from members list
        const memberIds = Object.keys(this.clubData.members);
        for (let i = 0; i < memberIds.length; i += 20) {
            const ids = memberIds.slice(i, i + 20);
            const names = await this.api.getPlayerDisplayNames(ids);
            const tags = await this.api.getPlayerDisplayTags(ids);
            //doing names and tag separately because the api doesnt always return the same amount of data
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                this.clubData.members[name.accountId].name = name.displayName;
            }
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                this.clubData.members[tag.accountId].tag = tag.clubTag;
            }
        }
        this.clubData.memberCount = count;
    }

    async UpdateClubInfo(clubId) {
        const req = await this.api.getClubData(clubId);

        this.clubData.name = req.name;
        this.clubData.tag = req.tag;
        this.clubData.id = req.id;

    }



}

// export app
module.exports = { App };

