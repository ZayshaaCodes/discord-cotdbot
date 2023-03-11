const { NadeoAPI } = require('./NadeoAPI');
const { NadeoAuth } = require('./NadeoAuth');
const { DiscordClient } = require('./discordClient');
const { ClubData, ClubMember } = require('./ClubData');
const fs = require('fs');
require('dotenv').config();

// class ClubData {
//     constructor() {
//       this.name = "";
//       this.tag = "";
//       this.id = 0;
//       this.members = {};
//     }
//   }

//   class ClubMember
//   {
//     constructor(id, name) {
//       this.id = id;
//       this.name = name;
//       this.tag = "";
//     }
//   }
class App {
    constructor() {
        this.auth = null;
        this.api = null;
        this.client = null;
        this.clubData = null;
    }

    async start() {

        this.clubdata = new ClubData();
        const updateClub = false;

        const date = new Date();
        console.log("starting at " + date.toLocaleString());

        const clubId = process.env.CLUB_ID;
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);

        while (!this.client.connected) {
            await new Promise(r => setTimeout(r, 100));
        }

        const channel = this.client.getChannelByName("bot");

        //purge all messages in the channel
        await channel.bulkDelete(100);

        this.auth = new NadeoAuth(process.env.UBI_USER, process.env.UBI_PASS);
        await this.auth.init();

        this.api = new NadeoAPI(this.auth);

        if (updateClub) {
            await this.UpdateClubInfo(clubId, channel);
            await this.UpdateClubMemberInfo(clubId);
            fs.writeFileSync("src/clubdata.json", JSON.stringify(this.clubdata, null, 2));
        } else {
            const fileData = JSON.parse(fs.readFileSync("src/clubdata.json"));
            this.clubdata = Object.assign(new ClubData(), fileData);
        }

        var daysData = (await this.api.getTOTDData()).days;
        var lastDay = daysData[daysData.length - 1].map;

        var mapinfo = {
            mapUid: lastDay.mapUid,
            mapName: lastDay.name
        };

        const challengeData = await this.api.getChallengeList();

        for (const challenge of challengeData) {
            // if "COTD" is in the name
            if (challenge.name.indexOf("COTD") > -1) {
                var challengeDate = new Date(challenge.startDate * 1000);
                var timeTill = challengeDate - date;
                console.log(challenge.name + ' starts at ' + challengeDate.toLocaleString() + '. diff: ' + this.msToTime(timeTill));
            }
        }
        
        
        // console.log(this.clubdata);

        // const id = await this.api.getCurrentCOTDChallengeId()
        // console.log(id.id);
        // const challengeLeaderboard = await this.api.getChallengeLeaderboard(id.id);
        // console.log(challengeLeaderboard);


        // this.client.sendTextAndJson(channel, "Club Info", JSON.stringify(members, null, 2));

        // save clubdata to file


        // this.client.sendTextAndJson(channel, "Club Info", JSON.stringify(this.clubdata, null, 2));



        // //list of just ids without using map
        // const memberIds = [];
        // for (let i = 0; i < members.length; i++) {
        //     const member = members[i];
        //     memberIds.push(member.accountId);
        // }

        // this.client.sendTextAndJson(channel, "Club Members", JSON.stringify(memberIds, null, 2));

    }

    // convert milliseconds to hh:mm:ss format, if time is negative include a - sign at the start
    msToTime(ms) {
        var sign = ms < 0 ? "-" : "";
        var seconds = Math.floor((Math.abs(ms) / 1000) % 60);
        var minutes = Math.floor((Math.abs(ms) / (1000 * 60)) % 60);
        var hours = Math.floor((Math.abs(ms) / (1000 * 60 * 60)) % 24);

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
            for (let i = 0; i < ids.length; i++) {
                this.clubdata.members[ids[i]].name = names[i].displayName;
                if (tags[i] != null)
                    this.clubdata.members[ids[i]].tag = tags[i].clubTag;
            }
        }
    }

    async UpdateClubInfo(clubId) {
        const clubReqData = await this.api.getClubData(clubId);

        this.clubdata.name = clubReqData.name;
        this.clubdata.tag = clubReqData.tag;
        this.clubdata.id = clubReqData.id;
    }

    async test() {

        const api = new NadeoAPI();
        await this.NadeoLiveServices.authenticate();
        await this.NadeoServices.authenticate();
        await this.NadeoClubServices.authenticate();

        const clubMembers = await api.getMemberIdsFromClub(this.NadeoLiveServices, 39343, 0, 20);
        console.log(clubMembers);

        //in groups of 20, get club members and append
        for (let i = 20; i < 100; i += 20) {
            const members = await api.getMemberIdsFromClub(this.NadeoLiveServices, 39343, i, 20);
            console.log(members);
            clubMembers.push(...members);
        }


        const challanges = await api.getChallengeList(this.NadeoClubServices, 5, 0);
        // console.log(challanges);
        //make a list with just the ids and names
        const challangesList = [];
        for (let i = 0; i < challanges.length; i++) {
            const challange = challanges[i];
            challangesList.push({ id: challange.id, name: challange.name });
        }
        // console.log(challangesList);

        const current = await api.getCurrentCOTDChallengeId(this.NadeoClubServices);
        console.log(current);

        const map = "ho7WKyIBTV_dNmP9hFFadUvvtLd";
        const cid = current;

        // const cdata = await api.getChallengeData(this.nadeoClub, cid);
        // console.log(cdata);

        const names = await api.getPlayerDisplayNames(this.NadeoServices, clubMembers);
        const tags = await api.getPlayerDisplayTags(this.NadeoServices, clubMembers);
        const standing = await api.GetCurrentStandingForPlayers(this.NadeoClubServices, clubMembers, cid, map);
        console.log(standing);

        let s = "";
        //freach each record in the standing
        for (let i = 0; i < standing.records.length; i++) {
            const record = standing.records[i];
            // console.log(record);

            //get the player name with maching id
            const name = names.find(x => x.accountId == record.player);
            //get tag with matching id
            const tag = tags.find(x => x.accountId == record.player);
            // console.log(tag);
            //check if tag undefined

            let tagString = "";
            if (tag != undefined) {
                tagString = "[" + tag.clubTag + "]";
                tagString = tagString.replace(/\$[wnoitsgzWNOITSGZ]|(\$[0-9a-fA-F]{3})/g, '')
            }

            s += tagString + name.displayName + " | " + record.rank + " | " + record.score + "\n";
        }

        //remove the last \n
        s = s.slice(0, -1);

        return s;
    }
}

const app = new App();
app.start();
