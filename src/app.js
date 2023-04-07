// const { NadeoAPI } = require('./interop/NadeoAPI');
const { NadeoAuth } = require('./interop/NadeoAuth');

const { DiscordClient } = require('./interop/discordClient');
const { ClubData, ClubMember } = require('./objects/ClubData');
const ScheduledTasks = require('./ScheduledTasks');

const { Canvas, registerFont } = require('canvas');
const PNG = require('pngjs').PNG;

const fs = require('fs');
const { ApiUtils } = require('./Utils');
const tmClasses = require('./interop/TmObjects');
const TmApi = require('./interop/TmApi');
require('dotenv').config();

class App {
    constructor() {
        this.auth = null;
        this.api = TmApi;
        this.client = null;
        this.botChannel = null;
        this.clubData = null;
        this.cotdhours = [2, 10, 18];
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
        registerFont('resources/forkawesome-webfont.ttf', { family: 'Fork Awesome' });


        //discord client
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);
        while (!this.client.connected) await new Promise(r => setTimeout(r, 100));
        this.botChannel = this.client.getChannelByName("bot");

        // --------------- COTD COMMAND ---------------
        // this.client.registerNewCommand("cotd", "get current cotd", async (interaction) => {
            // const cotd = await this.getMostRecentCOTD();
            // const map = await this.getTodaysMap();
            // interaction.reply("Map: " + App.tmSplit(map.name).plain + "\nchallenge id: " + cotd.recent.id);
        // });

        // --------------- STANDING COMMAND ---------------
        this.client.registerNewCommand("standing", "get current cotd standings", async (interaction) => {
            const msg = await interaction.reply("Fetching records...");

            // const chalId = (await this.getMostRecentCOTD()).recent.id;
            //get the current challenge
            //get the current map


            let data = await this.GetChallengeStandingsCached(chalId);
            if (data.length == 0) data = "No records yet!";

            // create canvas and context
            const imageBuffer = GenerateStandingsTableImage(data);
            
            msg.edit({ files: [imageBuffer] });
        });
        
        console.log( await ApiUtils.getMapForDate(this.api) );

        const tags = await this.api.getPlayerDisplayTags(this.clubData.members);

        if (false) {
            await this.UpdateClubData(39343);
        }
    }

    async start() {
        await this.init();

        const hrs = this.cotdhours.join(","); // just so i can test easier

        // --------------------- start of cotd ---------------------
        this.scheduledTasks.add("start", `1 ${hrs} * * *`, async () => { // 0th minute of the hour
            this.curCotd = await this.getMostRecentCOTD();
            if (this.curCotd.isNewMap) {
                this.currentMap = await this.getCurrentMap();
            }

            this.botChannel.send(this.curCotd.recent.name + " starting!");
            this.botChannel.send("Map: " + App.tmSplit(this.currentMap.name).plain);
            this.botChannel.send("challenge id: " + this.curCotd.recent.uid);
        });

        // --------------------- cotd polling ---------------------
        this.scheduledTasks.add("poll", `16 ${hrs} * * *`, async () => { // every minute from 1 to 15
            let standings = await this.GetRecentStandings();
            if (standings.length == 0) standings = "No records yet!";

            this.botChannel.send(standings);
        });

        // --------------------- end of cotd ---------------------
        this.scheduledTasks.add("end", `16 ${hrs} * * *`, async () => { // 16th minute of the hour
            this.botChannel.send("COTD qualifying is ending!");
        });

    }

    async GetRecentStandings() {
        const cotd = await this.getMostRecentCOTD();
        const map = await this.getCurrentMap();

        const allStanding = await this.GetChallengeStandings(cotd.recent.id, map.mapUid);

        //save to cache
        const cacheFile = `./cache/${cotd.recent.id}.json`;
        fs.writeFileSync(cacheFile, JSON.stringify(allStanding, null, 2));

        let print = "";
        for (const record of allStanding) {
            print += `${record.rank} - ${record.playerName} - ${App.msToTime(record.score)}\n`;
        }
        return print;
    }

    async GetChallengeStandingsCached(challengeId) {
        const cacheFile = `./cache/${challengeId}.json`;
        if (fs.existsSync(cacheFile)) {
            const data = fs.readFileSync(cacheFile);
            const jsonData = JSON.parse(data);
            return jsonData;
        } else {
            const map = await this.getCurrentMap();



            return await this.GetChallengeStandings(challengeId);
        }
    }

    async GetChallengeStandings(challengeId) {

        //get map for this challenge, so we can get the mapUid
        const map = await this.api.getMapForDate();

        let members = Object.keys(this.clubData.members);
        const allStanding = [];
        for (let i = 0; i < members.length; i += 20) {
            let ids = members.slice(i, i + 20);
            let standing = await this.api.GetCurrentStandingForPlayers(ids, challengeId, mapUid);
            allStanding.push(...standing.records);
        }

        for (const record of allStanding) {
            record.playerName = this.clubData.members[record.player].name;
            record.playerTag = this.clubData.members[record.player].tag;
        }

        // sort by rank
        allStanding.sort((a, b) => a.rank - b.rank);
        console.log(allStanding);

        const cacheFile = `./cache/${challengeId}.json`;
        fs.writeFileSync(cacheFile, JSON.stringify(allStanding, null, 2));

        return allStanding;
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