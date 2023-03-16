const fs = require('fs');

class ClubData {
  constructor() {
    this.name = "";
    this.tag = "";
    this.id = 0;
    this.members = {};
  }

  async loadFromFile() {
    const fileData = await fs.promises.readFile("src/clubdata.json");
    this.clubdata = Object.assign(new ClubData(), fileData);
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