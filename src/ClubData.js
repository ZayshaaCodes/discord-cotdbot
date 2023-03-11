class ClubData {
  constructor() {
    this.name = "";
    this.tag = "";
    this.id = 0;
    this.members = {};
  }
}

class ClubMember
{
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tag = "";
  }
}

module.exports = { ClubData, ClubMember };