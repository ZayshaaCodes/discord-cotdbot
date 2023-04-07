const fs = require('fs');

class playerDict {
    constructor() {
        this.playerDict = {};
    }

    getKeys () {
        return Object.keys(this.playerDict);  
    } 

    async loadFromFile() {
        try {
            const fileData = await fs.promises.readFile("cache/playerDict.json");
            const data = JSON.parse(fileData);
            Object.assign(this.playerDict, data);
            return true;
        } catch (err) {
            console.log(err);
        }
        return false;
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile("cache/playerDict.json", JSON.stringify(this.playerDict));
            return true;
        } catch (err) {
            console.log(err);
        }
        return false;
    }

    //takes in a list of objects and add player info to each item based on their id
    appendPlayerInfoToObjectList(playerList) {
        for (let i = 0; i < playerList.length; i++) {
            let player = this.playerDict[playerList[i].playerId];
            if (player) {
                playerList[i].playerName = player.name;
                playerList[i].playerTag = player.tag;
                playerList[i].playerZone = player.zone;
            }
        }
    }

    /**
     * @param {string} playerId
     */
    addPlayer(playerId) {
        this.playerDict[playerId] = {playerId}
    }

    /**
     * @param {[string]} playerIdList
     */
    addPlayerIds(playerIdList) {
        for (let i = 0; i < playerIdList.length; i++) {
            if (!(playerIdList[i] in this.playerDict)) {
                this.playerDict[playerIdList[i]] = {playerId: playerIdList[i]};
            }
        }
    }


    /**
     * @param {string} id
     * @returns {tmPlayer}
     */
    getPlayer(id) {
        if (id in this.playerDict) {
            return this.playerDict[id];
        }
        return null;
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    getPlayerName(id) {
        if (id in this.playerDict) {
            return this.playerDict[id].name;
        }
        return "";
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    getPlayerTag(id) {
        if (id in this.playerDict) {
            return this.playerDict[id].tag;
        }
        return "";
    }

    /**
     * @param {string} id
     * @returns {number}
     */
    getPlayerZone(id) {
        if (id in this.playerDict) {
            return this.playerDict[id].zone;
        }
        return 0;
    }
}

module.exports = { playerDict };