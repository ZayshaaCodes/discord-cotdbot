const { json } = require("stream/consumers");
const { NadeoAuth } = require("./NadeoAuth");
const { log } = require("console");

class TmCoreAPI {
    /**
     * @argument {NadeoAuth} auth
     */
    constructor(auth) {
        this.coreURL = "https://prod.trackmania.core.nadeo.online";
        this.auth = auth;
    }

    // api/routes
    async getRoutes() {
        const url = `${this.coreURL}/api/routes`;
        const routes = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return { url: this.coreURL, routes };
    }

    /** 
     * @param {[string]} players
     * @returns {Promise<[{accountId: string, clubTag: string}]>}
     */
    async getPlayerDisplayTags(players) {
        const url = `${this.coreURL}/accounts/clubTags/?accountIdList=${players}`;
        const playerInfo = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return playerInfo;
    }

    /** 
     * @param {[string]} players
     * @returns {Promise<[{accountId: string, zoneId: string}]>}
     */
    async getPlayerZones(players) {
        const url = `${this.coreURL}/accounts/zones/?accountIdList=${players}`;
        const playerInfo = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return playerInfo;
    }


    /** 
     * @param {string[]} players 
     * @returns {Promise<[{accountId: string, displayName: string}]>}
    */
    async getPlayerDisplayNames(players) {
        const url = `${this.coreURL}/accounts/displayNames/?accountIdList=${players}`;
        const playerInfo = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return playerInfo;
    }

    //GET https://prod.trackmania.core.nadeo.online/mapRecords/{mapRecordId}
    async getMapRecord(mapRecordId) {
        const url = `${this.coreURL}/mapRecords/${mapRecordId}`;
        const mapRecord = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return mapRecord;
    }

    async getZones() {
        const url = `${this.coreURL}/zones`;
        const zones = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
        return zones;
    }


    /**
     * @param {string} mapUidList
     * @param {string} accountId
     * @returns {Promise<[{name : string, author : string, authorScore : number, goldScore : number, silverScore : number, bronzeScore : number, mapUid : string, mapId : number, mapType : number, filename : string, fileUrl : string, thumbnailUrl : string}]>}
     */
    async getMapData(mapUidList) {
        const mapListEndpoint = `${this.coreURL}/maps/?mapUidList=${mapUidList}`;
        const mapList = await makeAPIRequest(mapListEndpoint, "GET", null, await this.auth.getNadeoServicesToken());
        const data = [];
        for (const map of mapList) {
            const mapData = {
                name: map.name,
                author: map.author,
                authorScore: map.authorScore,
                goldScore: map.goldScore,
                silverScore: map.silverScore,
                bronzeScore: map.bronzeScore,
                mapUid: map.mapUid,
                mapId: map.mapId,
                mapType: map.mapType,
                filename: map.filename,
                fileUrl: map.fileUrl,
                thumbnailUrl: map.thumbnailUrl
            }
            data.push(mapData);
        }

        return data;
    }
}

class TmLiveAPI {
    /**
     * @argument {NadeoAuth} auth
     */
    constructor(auth) {
        this.liveURL = "https://live-services.trackmania.nadeo.live";
        this.auth = auth;
    }


    /**
    * @param {Number} clubId 
    * @returns {Promise<{id: Number, name: String, tag: String, description: String}>}
    */
    async getClubData(clubId) {
        const url = `${this.liveURL}/api/token/club/${clubId}`;
        const clubInfo = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoLiveServicesToken());
        const data = {
            id: clubInfo.id,
            name: clubInfo.name,
            tag: clubInfo.tag,
            description: clubInfo.description
        }
        return data;
    }

    /**
     * @async
     * @param {Number} clubId 
     * @param {Number} offset
     * @param {Number} length
     * @returns {Promise<{clubMemberList: [{accountId: String, role: String, vip, Boolean}], maxPage: Number, itemCount: Number}>
     */
    async getMemberIdsFromClub(clubId, offset = 0, length = 20) {
        const url = `${this.liveURL}/api/token/club/${clubId}/member?offset=${offset}&length=${length}`;
        const token = await this.auth.getNadeoLiveServicesToken();

        const clubInfo = await makeAPIRequest(url, "GET", null, token);
        if (clubInfo.length <= 1) {
            return [];
        }

        return clubInfo;
    }

    /**
     * @param {Number} clubId
     * @param {String} newTag
     */
    async changeClubTag(clubId, newTag) {
        const url = `${this.liveURL}/api/token/club/${clubId}/edit`;
        const token = await this.auth.getNadeoLiveServicesToken();
        const data = {
            tag: newTag
        }
        const clubInfo = await makeAPIRequest(url, "POST", data, token);
        return clubInfo;
    }

    /**
     * @param {String} mapUid
     * @returns {Promise<{groupUid: String, mapUid: String, score: Number, zones: [{zoneId: String, zoneName: String, ranking: {position: Number, length: Number}}]}>}
     */
    async getPersonalBests(mapUid) {
        const url = `${this.liveURL}/api/token/leaderboard/group/Personal_Best/map/${mapUid}`;
        const token = await this.auth.getNadeoLiveServicesToken();
        const personalBests = await makeAPIRequest(url, "GET", null, token);
        return personalBests;
    }

    //others
    //https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/Personal_Best/map/HVWPIUGFbtDTbQ6_r5bRL3MWWwj/club/39343/surround/1/1
    //https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/Personal_Best/map/HVWPIUGFbtDTbQ6_r5bRL3MWWwj/club/39343/top
    //https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/Personal_Best/map/HVWPIUGFbtDTbQ6_r5bRL3MWWwj/surround/1/1
    //https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/Personal_Best/map/HVWPIUGFbtDTbQ6_r5bRL3MWWwj/top
    //https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/Personal_Best/map/HVWPIUGFbtDTbQ6_r5bRL3MWWwj
}

class TmClubAPI {
    /**
     * @argument {NadeoAuth} auth
     */
    constructor(auth) {
        this.clubclubURL = "https://club.trackmania.nadeo.club";
        this.compclubURL = "https://competition.trackmania.nadeo.club";
        this.matchclubURL = "https://matchmaking.trackmania.nadeo.club";
        this.auth = auth;
    }

    // api/routes
    async getRoutes() {
        const url = `${this.clubclubURL}/routes`;
        const routes = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoLiveServicesToken());
        return { url: this.clubclubURL, routes };
    }

    /**
     * @returns {Promise<{edition: string, id: string, uid: string, name: string, leaderboardId: string}>}
     */
    async getCurrentCOTDChallenge() {
        const url = `${this.compclubURL}/api/cup-of-the-day/current`;
        const matchStatus = await makeAPIRequest(url, "GET", null, await this.auth.getNadeoClubServicesToken());
        const data = {
            edition: matchStatus.edition,
            id: matchStatus.challenge.id,
            uid: matchStatus.challenge.uid,
            name: matchStatus.challenge.name,
            leaderboardId: matchStatus.challenge.leaderboardId,
        }
        return data;
    }

    /**
     * @param {number} challengeId
     * @param {number} length
     * @param {number} offset
     * @returns {Promise<{uid: string, cardinal: number, records: [{player: string, score: number, rank: number}]}>}
    */
    async getChallengeStandings(challengeid, mapid, length = 20, offset = 0) {
        let playersEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/maps/${mapid}/?length=${length}&offset=${offset}`;
        const res = await makeAPIRequest(playersEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        return res;
    }

    /**
     * @param {number} challengeId
     * @param {number} length
     * @param {number} rank
     * @returns {Promise<{rank: number, player: string, time: number, score: number, uid : string}>}
    */
    async getChallengeStanding(challengeid, mapid, rank = 1) {
        let playersEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/maps/${mapid}/?length=1&offset=${rank - 1}`;
        const res = await makeAPIRequest(playersEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        return res[0];
    }

    /**
     * @param {[string]} players - Array of player IDs 
     * @param {string} challengeid - Challenge ID 
     * @param {string} mapid - Map ID 
     * @returns {Promise<{uid: string, cardinal: number, records: [{player: string, score: number, rank: number}]}>}
     */
    async GetChallengeStandingForPlayers(challengeid, mapid, players) {
        let playersEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/maps/${mapid}/players?players[]=${players.join("&players[]=")}`;

        const res = await makeAPIRequest(playersEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());

        return res;
    }

    /**
     * @param {number} challengeId
     * @returns {Promise<{ id: number, uid: string, name: string, startDate: string, endDate: string, status: string, leaderboardId: string }>}
    */
    async getChallenge(challengeId) {
        const challengeInfoEndpoint = `${this.compclubURL}/api/challenges/${challengeId}`;
        const result = await makeAPIRequest(challengeInfoEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        const data = {
            id: result.id,
            uid: result.uid,
            name: result.name,
            startDate: result.startDate,
            endDate: result.endDate,
            status: result.status,
            leaderboardId: result.leaderboardId,
        }
        return data;
    }

    /**
     * @param {number} length
     * @param {number} offset
     * @returns {Promise<[{id: number, uid: string, name: string, startDate: string, endDate: string, status: string, leaderboardId: string}]>}
    */
    async getChallengesList(length = 5, offset = 0) {
        const challengeListEndpoint = `${this.compclubURL}/api/challenges?length=${length}&offset=${offset}`;
        const challengeList = await makeAPIRequest(challengeListEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        const data = [];
        for (let i = 0; i < challengeList.length; i++) {
            const challenge = challengeList[i];
            data.push({
                id: challenge.id,
                uid: challenge.uid,
                name: challenge.name,
                startDateString: new Date(challenge.startDate * 1000).toUTCString(),
                startDate: challenge.startDate,
                endDateString: new Date(challenge.endDate * 1000).toUTCString(),
                endDate: challenge.endDate,
                status: challenge.status,
                leaderboardId: challenge.leaderboardId,
            });
        }

        return data;
    }

    /**
     * @param {number} challengeId
     * @param {number} length
     * @param {number} offset
     * @returns {Promise<{ challengeId: number, cardinal: number, scoreUnit: string, results: [{ points: number, player: string, score: number, rank: number, zone: string }]}>}
    */
    async getChallengeLeaderboard(challengeId, length = 20, offset = 0) {
        const challengeLeaderboardEndpoint = `${this.compclubURL}/api/challenges/${challengeId}/leaderboard?length=${length}&offset=${offset}`;
        const challengeLeaderboard = await makeAPIRequest(challengeLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        return challengeLeaderboard;
    }

    /**
     * @param {number} challengeId
     * @param {number} length
     * @param {number} offset
     * @returns {Promise<[{ id: number, uid: string, name: string, startDate: string, endDate: string, status: string, leaderboardId: string, nbPlayers: number}]>}
     */
    async getCompetitionList(length = 10, offset = 0) {
        const competitionListEndpoint = `${this.compclubURL}/api/competitions?length=${length}&offset=${offset}`;
        const competitionList = await makeAPIRequest(competitionListEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        const data = []
        for (let i = 0; i < competitionList.length; i++) {
            const competition = competitionList[i];
            data.push({
                id: competition.id,
                liveId: competition.liveId,
                creator: competition.creator,
                name: competition.name,
                startDate: competition.startDate,
                endDate: competition.endDate,
                nbPlayers: competition.nbPlayers,
                leaderboardId: competition.leaderboardId,
                region: competition.region,
            });
        }
        return data;
    }

    /**
     * @param {number} competitionId
     * @param {number} length
     * @param {number} offset
     * @returns {Promise<[{ participant: string, score: number, rank: number, zone: string}]>}
     */
    async getCompetitionLeaderboard(competitionId, length = 20, offset = 0) {
        const competitionLeaderboardEndpoint = `${this.compclubURL}/api/competitions/${competitionId}/leaderboard?length=${length}&offset=${offset}`;
        const competitionLeaderboard = await makeAPIRequest(competitionLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        return competitionLeaderboard;
    }

    //GET https://competition.trackmania.nadeo.club/api/challenges/{challengeId}/leaderboard?length={length}&offset={offset}
    async getChallengeLeaderboard(challengeId, length = 20, offset = 0) {
        const challengeLeaderboardEndpoint = `${this.compclubURL}/api/challenges/${challengeId}/leaderboard?length=${length}&offset=${offset}`;
        const challengeLeaderboard = await makeAPIRequest(challengeLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
        return challengeLeaderboard;
    }

}

class TmIo {
    constructor() {
        this.url = "https://trackmania.io";
    }

    /**
     * @param {number} monthsBack
     * @returns {Promise<{ year: number, month: number, lastday: number, monthoffset: number, monthCount: number, 
     * days: [{ campaignid: number, map: 
     *      { name: string, author: string, authorScore: number, goldScore: number, silverScore: number, bronzeScore: number, mapUid: string, mapId: number, mapType: number, filename: string, fileUrl: string, thumbnailUrl: string },
     * weekday: number, monthday: number, leaderboarduid: string}]}>};
     */
    async getTOTDData(monthsBack) {
        const url = `${this.url}/api/totd/${monthsBack}`;
        const totdData = await makeAPIRequest(url, "GET");
        return totdData;
    }
}

/**
* @param {string} url - The endpoint url to make a request.
* @param {string} [method="GET"] - The HTTP method to be used.
* @param {Object} [body=null] - The data to send in the request body.
* @param {string} [token=null] - The token to authenticate the request.
* @returns {Promise<Object>} - A promise that resolves to a JSON response from the endpoint.
*/
async function makeAPIRequest(url, method = "GET", body = null, token = null) {
    console.log(`API request to ${url}`);
    const response = await fetch(url, {
        method: method,
        headers: token
            ? { "Content-Type": "application/json", Authorization: `nadeo_v1 t=${token}` }
            : { "Content-Type": "application/json" },
        //limit length of body to 200 characters
        body: body ? JSON.stringify(body).substring(0, 200) : null,
    });
    if (!response.ok) console.error(`API request failed: ${response.statusText}`);

    // console.log(response);
    return response.json();
}


class TmApi {
    constructor(auth) {
        this.core = new TmCoreAPI(auth);
        this.live = new TmLiveAPI(auth);
        this.club = new TmClubAPI(auth);
        this.io = new TmIo();
    }


    /**
     * 
     * @returns {Promise<{challenge: {edition: number, id: number, uid: string, name: string, leaderboardId: number}, 
     * map: {author: string, name: string, mapType: string, mapStyle: string, authorScore: number, goldScore: number, 
     * silverScore: number, bronzeScore: number, mapUid: string, mapId: number, filename: string, fileUrl: string, thumbnailUrl: string}}>}
     */
    async getCurrentCOTDChallengeData() {
        const currentChallenge = await this.club.getCurrentCOTDChallenge();

        //extract the date from the name string, regex, group into year, month, day
        //sample: COTD 2023-04-10 #3 - Challenge
        const regex = /COTD (\d{4})-(\d{2})-(\d{2}) #\d+ - Challenge/;
        const match = regex.exec(currentChallenge.name);
        const monthVal = parseInt(match[2]);
        const dayVal = parseInt(match[3]);

        const currentMonth = new Date().getUTCMonth() + 1;
        const monthDiff = currentMonth - monthVal;

        const maps = await this.io.getTOTDData(monthDiff);
        const map = maps.days[dayVal - 1].map

        return { challenge: currentChallenge, map: map };
    }

}

module.exports = { TmApi };
