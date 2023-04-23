const fs = require('fs').promises;

class PlayerCache {
    constructor(filename, tmLiveAPI, tmCoreAPI) {
        this.cache = new Map();
        this.filename = filename;
        this.tmLiveAPI = tmLiveAPI;
        this.tmCoreAPI = tmCoreAPI;
        this.refreshInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    async loadCache() {
        try {
            const rawData = await fs.readFile(this.filename, 'utf-8');
            const data = JSON.parse(rawData);
            this.cache = new Map(Object.entries(data));
        } catch (error) {
            console.error('Error loading cache:', error);
        }
    }
    
    async saveCache() {
        try {
            const data = JSON.stringify(Object.fromEntries(this.cache));
            await fs.writeFile(this.filename, data, 'utf-8');
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }
    
    isPlayerInCache(accountId) {
        return this.cache.has(accountId);
    }
    
    async fetchPlayerData(accountId) {
        try {
            const displayNames = await this.tmCoreAPI.getPlayerDisplayNames([accountId]);
            const displayTags = await this.tmCoreAPI.getPlayerDisplayTags([accountId]);
            const zones = await this.tmCoreAPI.getPlayerZones([accountId]);
    
            const playerData = {
                accountId: accountId,
                displayName: displayNames[0].displayName,
                clubTag: displayTags[0].clubTag,
                zone: zones[0].zoneId,
                lastFetched: Date.now(),
            };
    
            this.cache.set(accountId, playerData);
            await this.saveCache();
            return playerData;
        } catch (error) {
            console.error('Error fetching player data:', error);
            return null;
        }
    }
    
    async getPlayer(accountId) {
        if (this.isPlayerInCache(accountId)) {
            const playerData = this.cache.get(accountId);
            if (Date.now() - playerData.lastFetched < this.refreshInterval) {
                return playerData;
            }
        }
    
        return await this.fetchPlayerData(accountId);
    }
    
    async fetchPlayerDataBatch(accountIds) {
        try {
            const displayNames = await this.tmCoreAPI.getPlayerDisplayNames(accountIds);
            const displayTags = await this.tmCoreAPI.getPlayerDisplayTags(accountIds);
            const zones = await this.tmCoreAPI.getPlayerZones(accountIds);

            const playerDataList = accountIds.map((accountId, index) => {
                return {
                    accountId: accountId,
                    displayName: displayNames[index].displayName,
                    clubTag: displayTags[index].clubTag,
                    zone: zones[index].zoneId,
                    lastFetched: Date.now(),
                };
            });

            playerDataList.forEach(playerData => {
                this.cache.set(playerData.accountId, playerData);
            });
            await this.saveCache();
            return playerDataList;
        } catch (error) {
            console.error('Error fetching player data batch:', error);
            return [];
        }
    }

    async getPlayerBatch(accountIds) {
        const playersToFetch = [];
        const result = [];

        accountIds.forEach(accountId => {
            if (this.isPlayerInCache(accountId)) {
                const playerData = this.cache.get(accountId);
                if (Date.now() - playerData.lastFetched < this.refreshInterval) {
                    result.push(playerData);
                } else {
                    playersToFetch.push(accountId);
                }
            } else {
                playersToFetch.push(accountId);
            }
        });

        if (playersToFetch.length > 0) {
            const fetchedPlayers = await this.fetchPlayerDataBatch(playersToFetch);
            result.push(...fetchedPlayers);
        }

        return result;
    }
}

module.exports = PlayerCache;