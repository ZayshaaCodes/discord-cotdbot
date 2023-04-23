require('dotenv').config();
const { Canvas } = require('canvas');

class AppUtils {


    /**
     * @param {Date} date
     * @returns {bool}
     */
    static isEuDst(date) {
        function getLastSundayOfMonth(month, year) {
            const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)); // Last day of the month
            const day = lastDayOfMonth.getUTCDay(); // Day of the week (0 = Sunday)
            return new Date(Date.UTC(year, month, lastDayOfMonth.getUTCDate() - day)); // Last Sunday of the month
        }

        const year = date.getUTCFullYear();
        const dstStart = getLastSundayOfMonth(2, year); // Last Sunday of March
        const dstEnd = getLastSundayOfMonth(9, year); // Last Sunday of October

        // Adjust to UTC hours to handle the change at 01:00 UTC
        dstStart.setUTCHours(1);
        dstEnd.setUTCHours(1);

        return date >= dstStart && date <= dstEnd;
    }

    /**
     * 
     * @param {string[]} arr 
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @returns {number} the x position of the end of the text
     */
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

    /**
     * 
     * @param {string} input 
     * @returns {{input: string, arr: string[], plain: string}}
     */
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

    /**
     * 
     * @param {{rank: number, playerTag: string, playerName: string, score: number}[]} data
     * @returns {Buffer}
     */
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
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            ctx.fillStyle = '#00ff00';
            ctx.fillText(item.rank, xPositions[0], y);
            // div = ciel(rank / 64)
            // divColor = gold when div 1, silver when div 2, bronze when div 3, white when div 4+
            const divColor = item.rank <= 64 ? '#ffd700' : item.rank <= 128 ? '#c0c0c0' : item.rank <= 192 ? '#cd7f32' : '#ffffff';
            ctx.fillStyle = divColor;
            ctx.fillText(Math.ceil(item.rank / 64), xPositions[1], y);

            ctx.fillStyle = '#ffffff';
            const tagEndX = AppUtils.drawTag(AppUtils.tmSplit(item.playerTag).arr, ctx, xPositions[2], y);
            ctx.fillText(item.playerName, tagEndX + 5, y);

            ctx.fillStyle = `rgb(255, 255, 255)`;
            ctx.fillText(item.score, xPositions[3], y);
            y += 25;
        }

        const imageBuffer = canvas.toBuffer();
        return imageBuffer;
    }

    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}

module.exports = { AppUtils };