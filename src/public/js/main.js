//fetch cotd standing from server



(async () => {
    //fetch cotd standing from server
    const chalId = await fetch('/api/lastChallenge');
    const cData = await chalId.json();
    console.log(cData);
    const id = cData;
    


    const response = await fetch(`/api/standing/${id}`);
    const data = await response.json();

    //render the data
    const cotdStanding = document.getElementById('cotdStanding');
    //sample item: { "player": "7f6fca0d-e30e-43e4-bae5-040c9b6f4693", "score": 44671, "rank": 12, "playerName": "Spec.TM" }

    // render a simple table
    cotdStanding.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Div</th>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td><span style="color: #0f0">${item.rank}</span></td>
                        <td>${Math.ceil(item.rank / 64)}</td>
                        <td>${"[" + tmTag(tmSplit(item.playerTag).arr) + "]&nbsp&nbsp&nbsp" + item.playerName}</td>
                        <td><span style="color: #0ff">${msToTime(item.score)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

)();

// generate html for a player tag from array of strings
function tmTag(arr) {
    let html = "";
    let openSpans = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].startsWith("$")) {
            if (arr[i].length == 4) {
                if (openSpans) {
                    html += "</span>";
                }
                html += `<span style="color: #${arr[i].substr(1)}">`;
                openSpans = true;
            }
        } else {
            html += arr[i];
        }
    }
    if (openSpans) {
        html += "</span>";
        openSpans = false;
    }

    return html;
}


function tmSplit(input) {
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

function msToTime(ms) {
    const sign = ms < 0 ? "-" : "";
    const milliseconds = Math.floor(Math.abs(ms) % 1000).toString().padStart(3, '0');
    const seconds = Math.floor((Math.abs(ms) / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((Math.abs(ms) / (1000 * 60)) % 60).toString()
    const hours = Math.floor(Math.abs(ms) / (1000 * 60 * 60));

    return `${sign}${hours ? `${hours}:` : ""}${minutes}:${seconds}.${milliseconds}`;
}