const fs = require('fs');
const { Canvas, registerFont } = require('canvas');
const PNG = require('pngjs').PNG;
const { DiscordClient } = require('./interop/discordClient');

const ScheduledTasks = require('./ScheduledTasks');
const { NadeoAuth } = require('./interop/NadeoAuth');
const { ClubData, ClubMember } = require('./objects/ClubData');
const TmApi = require('./interop/TmApi');
const { log } = require('console');
const { AppUtils } = require('./Utils');

require('dotenv').config();

class App {
    /**
     * @type {NadeoAuth}
     * @type {TmApi}
     * @type {DiscordClient}
     * @type {DiscordChannel}
     * @type {ClubData}
     */
    constructor() {
        this.auth = null; // NadeoAuth (authenticates with nadeo)
        this.api = null; // TmApi (interacts with TM api)
        this.client = null; // DiscordClient (interacts with discord)
        this.botChannel = null; // DiscordChannel (channel to send messages to)
        this.clubData = null; // ClubData (club data from TM api)
        this.cotdhours = [1, 2, 9, 10, 17, 18]; // hours of the day to start cotd (utc)
        this.scheduledTasks = new ScheduledTasks(); // ScheduledTasks (runs tasks at scheduled times)
    }

    async init() {
        this.auth = new NadeoAuth();
        await this.auth.init();

        this.api = new TmApi.TmApi(this.auth);

        this.clubData = new ClubData();
        await this.clubData.tryLoadFromFile();
        //this.clubData.updateClubData(this.api);

        console.log("starting at " + new Date());

        // const tableRenderer = new TableRenderer();
        //canvas dings
        registerFont('resources/forkawesome-webfont.ttf', { family: 'Fork Awesome' });

        //discord client
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);
        while (!this.client.connected) await new Promise(r => setTimeout(r, 100));
        this.botChannel = this.client.getChannelByName("bot");

        this.registerSlashCommands();

        try {
            const curCotd = await this.api.getCurrentCOTDChallengeData();
            log(curCotd);
        } catch (error) {
            log(error);
        }

        //starts on the last Sunday of March and ends on the last Sunday of October
        // //March 25th 2023 // sat
        // log("March 25th 2023 : " + AppUtils.isEuDst(new Date(2023, 2, 25)));
        // //March 26th 2023 // sun
        // log("March 26th 2023 : " + AppUtils.isEuDst(new Date(2023, 2, 26)));

        // //October 28th 2023
        // log("October 28th 2023 : " + AppUtils.isEuDst(new Date(2023, 9, 28)));
        // //October 29th 2023
        // log("October 29th 2023 : " + AppUtils.isEuDst(new Date(2023, 9, 29)));
    }

    dstCheck() {
        const now = new Date();
        return (!AppUtils.isEuDst(now) && now.getUTCHours() % 2 == 1)
            || (AppUtils.isEuDst(now) && now.getUTCHours() % 2 == 0)
    }

    async start() {
        await this.init();

        const hrs = this.cotdhours.join(","); // just so i can test easier


        // --------------------- start of cotd ---------------------
        this.scheduledTasks.add("start", `1 ${hrs} * * *`, async () => { // 0th minute of the hour
            // if dst and hour is odd, skip, if not dst and hour is even, skip
            if (this.dstCheck()) {
                this.botChannel.send("Skipping COTD start because of DST");
                return;
            }

            const data = await this.api.getCurrentCOTDChallengeData();

            log(data.challenge.name + " - " + data.map.name + " - " + data.map.mapUid);

            this.botChannel.send(`${data.challenge.name} is starting!`);
            this.botChannel.send(`Map: ${data.map.name}`);
        });

        // // --------------------- cotd polling ---------------------
        // this.scheduledTasks.add("poll", `16 ${hrs} * * *`, async () => { // every minute from 1 to 15
        //     let standings = await this.getRecentStandings();
        //     if (standings.length == 0) standings = "No records yet!";

        //     this.botChannel.send(standings);
        // });

        // // --------------------- end of cotd ---------------------
        // this.scheduledTasks.add("end", `16 ${hrs} * * *`, async () => { // 16th minute of the hour
        //     this.botChannel.send("COTD qualifying is ending!");
        // });

    }

    registerSlashCommands() {

        // --------------- COTD COMMAND ---------------
        // this.client.registerNewCommand("cotd", "get current cotd", async (interaction) => {
        // const cotd = await this.getMostRecentCOTD();
        // const map = await this.getTodaysMap();
        // interaction.reply("Map: " + App.tmSplit(map.name).plain + "\nchallenge id: " + cotd.recent.id);
        // });

        // --------------- STANDING COMMAND ---------------
        this.client.registerNewCommand("standing", "get current cotd standings", async (interaction) => {
            const msg = await interaction.reply("Fetching records...");

            let data = await this.api.getCurrentCOTDChallengeData();
            data.challenge
            let md = { name : data.challenge.name, map : data.map.name, mapUid : data.map.mapUid, records : [] };

            this.botChannel.send(`${JSON.stringify(md , null, 2)}`);

            // const imageBuffer = GenerateStandingsTableImage(data);
            // msg.edit({ files: [imageBuffer] });
        });
    }

    async getRecentStandings() {
        const cotd = await this.getMostRecentCOTD();
        const map = await this.getCurrentMap();

        const allStanding = await this.getChallengeStandings(cotd.recent.id, map.mapUid);

        //save to cache
        const cacheFile = `./cache/${cotd.recent.id}.json`;
        fs.writeFileSync(cacheFile, JSON.stringify(allStanding, null, 2));

        let print = "";
        for (const record of allStanding) {
            print += `${record.rank} - ${record.playerName} - ${App.msToTime(record.score)}\n`;
        }
        return print;
    }

    async getChallengeStandingsCached(challengeId) {
        const cacheFile = `./cache/${challengeId}.json`;
        if (fs.existsSync(cacheFile)) {
            const data = fs.readFileSync(cacheFile);
            const jsonData = JSON.parse(data);
            return jsonData;
        } else {
            const map = await this.getCurrentMap();



            return await this.getChallengeStandings(challengeId);
        }
    }

    async getChallengeStandings(challengeId) {

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

}

// export app
module.exports = { App };