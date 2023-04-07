
class NewObjectType {
  constructor(data) {
    this.id = data.id || null;
    this.uid = data.uid || null;
    this.name = data.name || null;
    this.scoreDirection = data.scoreDirection || null;
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.status = data.status || null;
    this.resultsVisibility = data.resultsVisibility || null;
    this.creator = data.creator || null;
    this.admins = data.admins || null;
    this.nbServers = data.nbServers || null;
    this.autoScale = data.autoScale || null;
    this.nbMaps = data.nbMaps || null;
    this.leaderboardId = data.leaderboardId || null;
    this.deletedOn = data.deletedOn || {};
    this.leaderboardType = data.leaderboardType || null;
    this.completeTimeout = data.completeTimeout || null;
  }

  static fromJSON(jsonData) {
    const data = JSON.parse(jsonData);
    return new NewObjectType(data);
  }
}

module.exports = NewObjectType;
