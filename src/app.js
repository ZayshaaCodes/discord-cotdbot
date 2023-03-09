const { NadeoAPI } = require('./NadeoAPI');
const { NadeoAuth } = require('./NadeoAuth');
const { DiscordClient } = require('./discordClient');
const fs = require('fs');
require('dotenv').config();

class App {
    constructor() {
        this.auth = null;
        this.api = null;
        this.client = null;
    }

    async start() {

        const clubId = process.env.CLUB_ID;
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);

        //wait till this.client.connected = true
        while (!this.client.connected) {
            await new Promise(r => setTimeout(r, 100));
        }

        const channel = this.client.getChannelByName("bot");

        //purge all messages in the channel
        await channel.bulkDelete(100);

        //send a message to the channel
        this.client.sendText(channel, "Hello World!");

        this.auth = new NadeoAuth(process.env.UBI_USER, process.env.UBI_PASS);
        await this.auth.init();

        console.log(this.auth);

        // this.api = new NadeoAPI(this.auth);

        // const clubdata = await this.api.getClubData(clubId);
        // this.client.sendTextAndJson(channel, "Club Data", JSON.stringify(clubdata, null, 2));

        // const members = (await this.api.getMemberIdsFromClub(clubId, 0, 10)).clubMemberList;

        // //list of just ids without using map
        // const memberIds = [];
        // for (let i = 0; i < members.length; i++) {
        //     const member = members[i];
        //     memberIds.push(member.accountId);
        // }

        // this.client.sendTextAndJson(channel, "Club Members", JSON.stringify(memberIds, null, 2));

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
