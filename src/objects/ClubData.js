const fs = require('fs');

/**
 * @typedef {import('../api/TmApi')} TmApi
 */
class ClubData {
  constructor(path, api) {
    this.name = "";
    this.tag = "";
    this.id = 0;
    this.membercount = 0;
    this.members = {};
    this.lastUpdated = 0;
    this.path = path;
    this.api = api;
  }

  async tryLoadFromFile() {
    try {

      const fileData = await fs.promises.readFile(this.path, 'utf-8');
      const data = JSON.parse(fileData);
      this.name = data.name;
      this.tag = data.tag;
      this.id = data.id;
      this.members = data.members;
      this.membercount = data.membercount;
      this.lastUpdated = data.lastUpdated;
      
      return true;
    } catch (err) {
      // console.log(err);
      console.log("No club data file found");
    }
    return false;
  }

  /**
   * @param {TmApi} api 
   */
  async updateClubData() {
    await this.updateClubInfo();
    await this.updateClubMemberInfo();
    this.lastUpdated = Date.now();
    const replacer = (key, value) => {
      if (key === 'api' || key === 'path') {
        return undefined; // exclude property from result
      }
      return value; // include property in result
    };
    fs.writeFileSync(this.path, JSON.stringify(this, replacer, 2));
  }

  async updateClubInfo() {
    const req = await this.api.live.getClubData(this.id);

    this.name = req.name;
    this.tag = req.tag;
    this.id = req.id;
  }

  async updateClubMemberInfo() {
    const pageSize = 20;
    let count = null;
    let pages = 1;
    this.members = {};

    for (let i = 0; i < pages; i++) {
      const membersReq = await this.api.live.getMemberIdsFromClub(this.id, i, pageSize);
      if (pages == 1) {
        count = membersReq.itemCount;
        pages = membersReq.maxPage;
      }

      const members = membersReq.clubMemberList;
      for (let i = 0; i < members.length; i++) {

        const members = membersReq.clubMemberList;
        //for each member, add to members
        for (let i = 0; i < members.length; i++) {
          const id = members[i].accountId;
          const memberData = new ClubMember(id, null);
          this.members[id] = memberData;
        }
      }
    }

    //map with id : name from members list
    const memberIds = Object.keys(this.members);
    for (let i = 0; i < memberIds.length; i += 20) {
      const ids = memberIds.slice(i, i + 20);
      const names = await this.api.core.getPlayerDisplayNames(ids);
      const tags = await this.api.core.getPlayerDisplayTags(ids);
      //doing names and tag separately because the api doesnt always return the same amount of data
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        this.members[name.accountId].name = name.displayName;
      }
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        this.members[tag.accountId].tag = tag.clubTag;
      }
    }
    this.membercount = count;
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