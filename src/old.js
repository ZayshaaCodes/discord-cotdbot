
const { createCanvas, registerFont } = require('canvas');
const PNG = require('pngjs').PNG;


function createTableFromString(dataString) {
    // Parse the data string into an array of objects
    const data = dataString.split('\n').map(line => {
        const [name, score, time] = line.split(' | ');
        return { name, score: Number(score), time: Number(time) };
    });

    const columnOffsets = [0, 0.1, 0.2, 0.8];

    // Register the font with the canvas
    registerFont('./src/forkawesome-webfont.ttf', { family: 'Fork Awesome' });

    const rowHeight = 30;
    const headerHeight = rowHeight * 1.5;
    const headerFont = 'bold 20px Fork Awesome';
    const rowFont = '20px Fork Awesome';

    const canvas = createCanvas(600, data.length * rowHeight + headerHeight);
    const context = canvas.getContext('2d');

    context.fillStyle = '#333333';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw table headers
    context.fillStyle = 'white';
    context.font = headerFont;
    context.fillText('Rank', 10 + canvas.width * columnOffsets[0], headerHeight / 2);
    context.fillText('Div', 10 + canvas.width * columnOffsets[1], headerHeight / 2);
    context.fillText('Player', 10 + canvas.width * columnOffsets[2], headerHeight / 2);
    context.fillText('Time', 10 + canvas.width * columnOffsets[3], headerHeight / 2);

    //sort the data by column 3 in reverse order
    data.sort((a, b) => a.time - b.time);

    // Draw table rows
    context.font = rowFont;
    data.forEach((row, index) => {
        const x = 10;
        const y = headerHeight + rowHeight * (index);

        context.fillStyle = 'lime';
        context.fillText(row.score, x + canvas.width * columnOffsets[0], y);

        //floored division is score / 64 floored
        context.fillStyle = 'white';
        const div = Math.floor(row.score / 64) + 1;
        context.fillText(div, x + canvas.width * columnOffsets[1], y);
        
        context.fillStyle = 'white';
        context.fillText(row.name, x + canvas.width * columnOffsets[2], y);

        //format in mm:ss.ms 42123 to "0:42.123"
        const timeInMilliseconds = row.time;
        const minutes = Math.floor(timeInMilliseconds / 60000); // 1 minute = 60000 milliseconds
        const seconds = Math.floor((timeInMilliseconds % 60000) / 1000); // 1 second = 1000 milliseconds
        const milliseconds = timeInMilliseconds % 1000;

        const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;

        context.fillStyle = 'cyan';
        context.fillText(formattedTime, x + canvas.width * columnOffsets[3], y);


    });

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const png = new PNG({
        width: canvas.width,
        height: canvas.height
    });

    for (let i = 0; i < imageData.data.length; i += 4) {
        png.data[i] = imageData.data[i];
        png.data[i + 1] = imageData.data[i + 1];
        png.data[i + 2] = imageData.data[i + 2];
        png.data[i + 3] = imageData.data[i + 3];
    }

    return PNG.sync.write(png);
}




