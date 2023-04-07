const { json } = require("node:stream/consumers");
const { NadeoAPI } = require("./interop/NadeoAPI");

class AppUtils {

    static drawTag(arr, ctx, x, y) {
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

    static GenerateStandingsTableImage(data) {
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

    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}

class ApiUtils {

    static async getMapForDate(api, date = new Date()) {
        const now = new Date();

        // Date can't be in the future, log and give up
        if (date.getTime() > now.getTime()) {
            console.log("date cant be in the future");
            return null;
        }

        const monthsDifference = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        const dayOfMonth = date.getUTCDay() - 1; // Subtract 1 to make it 0-based index

        try {
            console.log("monthsDifference", monthsDifference);
            const response = await api.getTOTDData(monthsDifference);
            console.log("responseData", response.days);


            if (responseData && responseData.days && responseData.days.length > dayOfMonth) {
                return responseData.days[dayOfMonth];
            } else {
                console.log("No map data available for the given date");
                return null;
            }
        } catch (error) {
            console.error("Error fetching map data:", error);
            return null;
        }
    }

    /**
     * @param { NadeoAPI } api
     * @param { string } challengeId
     */
    static async getChallengeById(api, challengeId) {
        
        return challenges.find(c => c.id === challengeId);
    }

    /**
     * @param { NadeoAPI } api
     * @param { string } challengeId
     */
    static async getMostRecentCOTD(api) {
        const challenges = (await api.getChallengeList(5, 0)).filter(c => c.name.includes("COTD"));
        const currentTime = new Date();
        for (const challenge of challenges) {
            const startDate = new Date(challenge.startDate * 1000 - 1000 * 60 * 3);
            const diff = startDate.getTime() - currentTime.getTime();
            if (diff < 0) {
                return challenge;
            }
        }
    }


    /**
     * @param { NadeoAPI } api
     * @param { string } challengeId
     * @param { [string] } players
     */
    static async GetChallengeStandings(api, players, challengeId) {
        const allStanding = [];
        for (let i = 0; i < players.length; i += 20) {
            let ids = players.slice(i, i + 20);
            let standing = await api.GetCurrentStandingForPlayers(ids, challengeId, mapUid);
            allStanding.push(...standing.records);
        }
        allStanding.sort((a, b) => a.rank - b.rank);

        return allStanding;

        // for (const record of allStanding) {
        //     record.playerName = this.clubData.members[record.player].name;
        //     record.playerTag = this.clubData.members[record.player].tag;
        // }

        // sort by rank

        // const cacheFile = `./cache/${challengeId}.json`;
        // fs.writeFileSync(cacheFile, JSON.stringify(allStanding, null, 2));
    }
}

module.exports = { AppUtils, ApiUtils };