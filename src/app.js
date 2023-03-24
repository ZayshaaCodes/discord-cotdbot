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
        registerFont('resources/forkawesome-webfont.ttf', { family: 'Fork Awesome' });


        //discord client
        this.client = new DiscordClient(process.env.DISCORD_TOKEN);
        while (!this.client.connected) await new Promise(r => setTimeout(r, 100));
        this.botChannel = this.client.getChannelByName("bot");

        // // --------------- COTD COMMAND ---------------
        // this.client.registerNewCommand("cotd", "get current cotd", async (interaction) => {
        //     const cotd = await this.getMostRecentCOTD();
        //     const map = await this.getTodaysMap();
        //     interaction.reply("Map: " + App.tmSplit(map.name).plain + "\nchallenge id: " + cotd.recent.id);
        // });

        // --------------- STANDING COMMAND ---------------
        this.client.registerNewCommand("standing", "get current cotd standings", async (interaction) => {
            const msg = await interaction.reply("Fetching records...");

            const chalId = (await this.getMostRecentCOTD()).recent.id;

            let data = await this.GetChallengeStandingsCached(chalId);
            if (data.length == 0) data = "No records yet!";

            // create canvas and context
            const imageBuffer = GenerateStandingsTableImage(data);
            
            msg.edit({ files: [imageBuffer] });
        });

        this.curCotd = await this.getMostRecentCOTD();
        this.currentMap = await this.getTodaysMap();

        console.log("current cotd: " + JSON.stringify(this.curCotd.recent, null, 2));
        console.log("current map: " + this.currentMap.name);

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
                this.currentMap = await this.getTodaysMap();
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
        const map = await this.getTodaysMap();

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
        }
    }

    async GetChallengeStandings(challengeId, mapUid) {
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

    static tmTag(arr, ctx, x, y) {
        let openSpans = false;
        let currentX = 0;

        ctx.fillText('[', x + currentX, y);
        currentX += ctx.measureText('[').width;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].startsWith("$")) {
                if (arr[i].length == 4) {
                    if (openSpans) {
                        ctx.restore();
                    }
                    const color = arr[i].substr(1);
                    ctx.save();
                    ctx.fillStyle = "#" + color;
                    openSpans = true;
                }
            } else {
                ctx.fillText(arr[i], x + currentX, y);
                currentX += ctx.measureText(arr[i]).width;
            }
        }
        if (openSpans) {
            ctx.restore();
            openSpans = false;
        }

        ctx.fillText(']', x + currentX, y);
        currentX += ctx.measureText(']').width;

        return currentX + x;
    }



    static tmSplit(input) {
        // Use regex to match Trackmania formatting characters
        const formattingRegex = /\$[oiwntsgzl$<]{1}|\$[0-9a-f]{3}|.+?/gi;
        const matches = input.match(formattingRegex) || [];

        const arr = [];
        const displayedText = [];
        for (let i = 0; i < matches.length; i++) {
            if (matches[i]) arr.push(matches[i]);
            if (matches[i] && !matches[i].startsWith("$")) {
                displayedText.push(matches[i]);
            }
        }
        const plain = displayedText.join("");
        return { input, arr, plain };
    }

    static msToTime(ms) {
        const sign = ms < 0 ? "-" : "";
        const milliseconds = Math.floor(Math.abs(ms) % 1000).toString().padStart(3, '0');
        const seconds = Math.floor((Math.abs(ms) / 1000) % 60).toString().padStart(2, '0');
        const minutes = Math.floor((Math.abs(ms) / (1000 * 60)) % 60).toString()
        const hours = Math.floor(Math.abs(ms) / (1000 * 60 * 60));

        return `${sign}${hours ? `${hours}:` : ""}${minutes}:${seconds}.${milliseconds}`;
    }

    async getTodaysMap() {
        const daysData = (await this.api.getTOTDData()).days;
        const day = daysData[daysData.length - 1];
        return day.map;
    }

    async getMostRecentCOTD() {
        const challenges = (await this.api.getChallengeList(5, 0)).filter(c => c.name.includes("COTD"));
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

function GenerateStandingsTableImage(data) {
    const canvasWidth = 500;
    const canvasHeight = data.length * 25 + 50; // dynamic height based on number of rows
    const canvas = new Canvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // render the data to canvas
    let y = 30;
    ctx.font = 'bold 20px Fork Awesome';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    //fill the background dark grey
    ctx.fillStyle = '#2c2f33';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const xPositions = [10, 60, 110, 400];
    //render table headers
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rank', xPositions[0], y);
    ctx.fillText('Div', xPositions[1], y);
    ctx.fillText('Player', xPositions[2], y);
    ctx.fillText('Score', xPositions[3], y);
    y += 25;

    //render table body
    ctx.font = 'bold 17px Fork Awesome';
    ctx.fillStyle = '#ffffff';
    data.forEach(item => {
        ctx.fillStyle = '#00ff00';
        ctx.fillText(item.rank, xPositions[0], y);
        // div = ciel(rank / 64)
        // divColor = gold when div 1, silver when div 2, bronze when div 3, white when div 4+
        const divColor = item.rank <= 64 ? '#ffd700' : item.rank <= 128 ? '#c0c0c0' : item.rank <= 192 ? '#cd7f32' : '#ffffff';
        ctx.fillStyle = divColor;
        ctx.fillText(Math.ceil(item.rank / 64), xPositions[1], y);

        ctx.fillStyle = '#ffffff';
        const tagEndX = App.tmTag(App.tmSplit(item.playerTag).arr, ctx, 110, y);
        ctx.fillText(item.playerName, tagEndX + 5, y);

        ctx.fillStyle = `rgb(0, 255, 255)`;
        ctx.fillText(App.msToTime(item.score), xPositions[3], y);
        y += 25;
    });

    const imageBuffer = canvas.toBuffer();
    return imageBuffer;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}