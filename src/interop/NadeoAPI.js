class NadeoAPI {
  constructor(auth) {
    this.coreURL = "https://prod.trackmania.core.nadeo.online";
    this.liveURL = "https://live-services.trackmania.nadeo.live";
    this.clubclubURL = "https://club.trackmania.nadeo.club";
    this.compclubURL = "https://competition.trackmania.nadeo.club";
    this.matchclubURL = "https://matchmaking.trackmania.nadeo.club";

    this.auth = auth;
  }

  // NadeoLiveServices - Live API
  // NadeoClubServices - Club API, Competition API, Matchmaking API
  // NadeoServices -     Core API

  async makeAPIRequest(url, method = "GET", body = null, token = null) {
    console.log(`API request to ${url}`);
    const response = await fetch(url, {
      method: method,
      headers: token ? { 'Content-Type': 'application/json', Authorization: `nadeo_v1 t=${token}` } : { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getClubData(clubId) {
    const url = `${this.liveURL}/api/token/club/${clubId}`;
    const clubInfo = await this.makeAPIRequest(url, "GET", null, await this.auth.getNadeoLiveServicesToken());
    return clubInfo;
  }

  async getMemberIdsFromClub(clubId, offset, length) {
    const url = `${this.liveURL}/api/token/club/${clubId}/member?offset=${offset}&length=${length}`;
    const token = await this.auth.getNadeoLiveServicesToken();

    const clubInfo = await this.makeAPIRequest(url, "GET", null, token);
    if (clubInfo.length <= 1) {
      return [];
    }

    return clubInfo;
  }

  async getCurrentCOTDChallengeId() {
    const url = `${this.compclubURL}/api/cup-of-the-day/current`;
    const matchStatus = await this.makeAPIRequest(url, "GET", null, await this.auth.getNadeoClubServicesToken());
    const challengeName = matchStatus.challenge.name;
    return matchStatus.challenge;
  }

  async getPlayerDisplayNames(players) {
    const url = `${this.coreURL}/accounts/displayNames/?accountIdList=${players}`;
    const playerInfo = await this.makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
    return playerInfo;
  }

  async getPlayerDisplayTags(players) {
    const url = `${this.coreURL}/accounts/clubTags/?accountIdList=${players}`;

    const playerInfo = await this.makeAPIRequest(url, "GET", null, await this.auth.getNadeoServicesToken());
    return playerInfo;
  }


  //GET https://competition.trackmania.nadeo.club/api/challenges/{challengeId}/records/maps/{mapId}/players?players[]=
  async GetCurrentStandingForPlayers(players, challengeid, mapid) {
    let playersEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/maps/${mapid}/players?players[]=`;

    // for(uint n = 0; n < players.Length; n++ )
    for (let n = 0; n < players.length; n++) {
      playersEndpoint += "&players[]=" + players[n];
    }

    const res = await this.makeAPIRequest(playersEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());

    return res;
  }

  //GET https://competition.trackmania.nadeo.club/api/challenges/{challengeId}
  async getChallengeData(challengeId) {
    const challengeInfoEndpoint = `${this.compclubURL}/api/challenges/${challengeId}`;
    const challengeInfo = await this.makeAPIRequest(challengeInfoEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
    return challengeInfo;
  }

  //GET https://competition.trackmania.nadeo.club/api/challenges?length={length}&offset={offset}
  async getChallengeList(length = 5, offset = 0) {
    const challengeListEndpoint = `${this.compclubURL}/api/challenges?length=${length}&offset=${offset}`;
    const challengeList = await this.makeAPIRequest(challengeListEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
    return challengeList;
  }

  //GET https://prod.trackmania.core.nadeo.online/maps/?mapUidList={mapUidList}
  async getMapData(auth, mapUidList) {
    const mapListEndpoint = `${this.coreURL}/maps/?mapUidList=${mapUidList}`;
    const mapList = await this.makeAPIRequest(mapListEndpoint, "GET", null, await this.auth.getNadeoServicesToken());
    return mapList;
  }

  //GET https://competition.trackmania.nadeo.club/api/challenges/{challengeId}/leaderboard?length={length}&offset={offset}
  async getChallengeLeaderboard(challengeId, length = 20, offset = 0) {
    const challengeLeaderboardEndpoint =
      `${this.compclubURL}/api/challenges/${challengeId}/leaderboard?length=${length}&offset=${offset}`;
    const challengeLeaderboard =
      await this.makeAPIRequest(challengeLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
    return challengeLeaderboard;
  }

  //GET https://competition.trackmania.nadeo.club/api/challenges/{challengeId}/records/?length={length}&offset={offset}
  async GetCurrentStandings(challengeid) {
    let playersEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/?length=10&offset=0`;

    // for(uint n = 0; n < players.Length; n++ )
    for (let n = 0; n < players.length; n++) {
      playersEndpoint += "&players[]=" + players[n];
    }

    const res = await this.makeAPIRequest(playersEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());

    return res;
  }

  //https://trackmania.io/api/totd/0
  async getTOTDData() {
    const url = `https://trackmania.io/api/totd/0`;
    const totdData = await this.makeAPIRequest(url, "GET");
    return totdData;
  }

  //https://live-services.trackmania.nadeo.live/api/token/club/58239/edit
  async changeClubTag(clubId, newTag) {
    const url = `${this.liveURL}/api/token/club/${clubId}/edit`;
    
    return clubInfo;
  }

  //GET https://competition.trackmania.nadeo.club/api/competitions?length={length}&offset={offset}
  async getCompetitionList(length = 10, offset = 0) {
    const competitionListEndpoint = `${this.compclubURL}/api/competitions?length=${length}&offset=${offset}`;
    const competitionList = await this.makeAPIRequest(competitionListEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
    return competitionList;
  }
  
  //GET https://competition.trackmania.nadeo.club/api/competitions/{competitionId}/leaderboard?length={length}&offset={offset}
  async getCompetitionLeaderboard(competitionId, length = 20, offset = 0) {
    const competitionLeaderboardEndpoint =
      `${this.compclubURL}/api/competitions/${competitionId}/leaderboard?length=${length}&offset=${offset}`;
    const competitionLeaderboard =  await this.makeAPIRequest(competitionLeaderboardEndpoint, "GET", null, await this.auth.getNadeoClubServicesToken());
    return competitionLeaderboard;
  }

  // async getDiv1CutoffTime(challengeid, mapid) {
  //   const cotdEndpoint = `${this.compclubURL}/api/challenges/${challengeid}/records/maps/${mapid}?offset=63&length=1`;
  //   const divOneCutoff = await this.makeAPIRequest(cotdEndpoint);
  //   if (divOneCutoff.length > 0) {
  //     const playerTime = divOneCutoff[0].score;
  //     const playerId = divOneCutoff[0].player;
  //     const playerRank = divOneCutoff[0].rank;
  //     return {
  //       playerId,
  //       playerRank,
  //       division: 1,
  //       time: playerTime,
  //     };
  //   }
  //   return null;
  // }
}

module.exports = { NadeoAPI };