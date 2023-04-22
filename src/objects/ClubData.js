const fs = require('fs');
const { TmApi } = require('../interop/TmApi');

class ClubData {
  constructor() {
    this.name = "";
    this.tag = "";
    this.id = 0;
    this.membercount = 0;
    this.members = {};
  }

  async tryLoadFromFile() {
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

  /**
   * @param {TmApi} api 
   */
  async updateClubData(api) {
    await this.updateClubInfo(api);
    await this.updateClubMemberInfo(api);
    fs.writeFileSync("cache/json", JSON.stringify(this, null, 2));
  }

  /**
  * @param {TmApi} api 
  */
  async updateClubInfo(api) {
    const req = await api.live.getClubData(this.id);

    this.name = req.name;
    this.tag = req.tag;
    this.id = req.id;
  }

  /**
   * @param {TmApi} api 
   */
  async updateClubMemberInfo(api) {
    const pageSize = 20;
    let count = null;
    let pages = 1;
    for (let i = 0; i < pages; i++) {
      const membersReq = await api.live.getClubMembers(this.id, i, pageSize);
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
      const names = await api.core.getPlayerDisplayNames(ids);
      const tags = await api.core.getPlayerDisplayTags(ids);
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