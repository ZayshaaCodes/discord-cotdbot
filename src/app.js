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

    async init() {

        this.client = new DiscordClient(process.env.DISCORD_TOKEN);

        //wait till this.client.connected = true
        while (!this.client.connected) {
            await new Promise(r => setTimeout(r, 100));
        }      

        var channel = this.client.getChannelByName("bot");

        //send a message to the channel
        this.client.sendText(channel, "Hello World!");


        //if init.json exists, deserialize it into a nadeo auth object
        if (fs.existsSync("src/tokens.json")) {
            var data = fs.readFileSync("src/tokens.json");
            var jsonData = JSON.parse(data);

            this.auth = NadeoAuth.fromJSON(jsonData);
        } else {
            this.auth = new NadeoAuth(process.env.UBI_USER, process.env.UBI_PASS);
            await this.auth.init();   

            //save the auth object to a file
            var data = JSON.stringify(this.auth);
            fs.writeFileSync("src/tokens.json", data);
        }

        this.api = new NadeoAPI(this.auth);

        // var name = await this.api.getClubName(39343);
        // console.log(name);
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


        var challanges = await api.getChallengeList(this.NadeoClubServices, 5, 0);
        // console.log(challanges);
        //make a list with just the ids and names
        var challangesList = [];
        for (let i = 0; i < challanges.length; i++) {
            const challange = challanges[i];
            challangesList.push({ id: challange.id, name: challange.name });
        }
        // console.log(challangesList);

        var current = await api.getCurrentCOTDChallengeId(this.NadeoClubServices);
        console.log(current);

        var map = "ho7WKyIBTV_dNmP9hFFadUvvtLd";
        var cid = current;

        // var cdata = await api.getChallengeData(this.nadeoClub, cid);
        // console.log(cdata);

        var names = await api.getPlayerDisplayNames(this.NadeoServices, clubMembers);
        var tags = await api.getPlayerDisplayTags(this.NadeoServices, clubMembers);
        var standing = await api.GetCurrentStandingForPlayers(this.NadeoClubServices, clubMembers, cid, map);
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
app.init();
