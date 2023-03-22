const fs = require('fs');

class ClubData {
  constructor() {
    this.name = "";
    this.tag = "";
    this.id = 0;
    this.membercount = 0;
    this.members = {};
  }

  async loadFromFile() {
    try {
      const fileData = await fs.promises.readFile("cache/clubdata.json");
      const data = JSON.parse(fileData);
      this.name = data.name;
      this.tag = data.tag;
      this.id = data.id;
      this.members = data.members;
      this.membercount = data.membercount;
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }
}

class ClubMember {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tag = "";
  }
}

module.exports = { ClubData, ClubMember };