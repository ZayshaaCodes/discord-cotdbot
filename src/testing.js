const { NadeoAuth } = require("./interop/NadeoAuth");
const { TmApi } = require("./interop/TmApi");
const { AppUtils } = require("./Utils");
const fs = require("fs");
const { playerDict } = require("./objects/PlayerLib");
const { json } = require("stream/consumers");
const ZoneCache = require("./ZoneCache");


(async () => {

    const auth = new NadeoAuth();
    await auth.init();
    const api = new TmApi(auth);


    const samplePlayerIds = [
        "90dc7c06-3fad-42ad-b92e-a230efb8f088",
        "76f34c93-b0eb-446b-b212-60ffc35e317d",
        "e2f42d3d-873f-4706-bf37-636a6296c7f0",
        "7abbbb05-eca7-4df5-8644-29edd8d33f44"
    ]

    const clubId = "39343";
    const challengeId = "2620";
    const mapUids = [
        '7xgnMnxO5ariWbUHksrLLCDGPN1',
        'HVWPIUGFbtDTbQ6_r5bRL3MWWwj'
    ];

    const zones = new ZoneCache();
    zones.loadFromJson();
    const node = zones.binarySearchTree("Oregon");
    console.log(node);

    // console.log(zones.binarySearchTree("Oregon"));
    
    // fs.writeFileSync("cache/zones.json", JSON.stringify(zoneDict, null, 4));

    // const members = [];
    // let maxPage = 1;
    // let page = 0;
    // while (page < maxPage) {
    //     const data = await api.live.getMemberIdsFromClub(clubId, page * 20, 20);
    //     members.push(...data.clubMemberList);
    //     maxPage = data.maxPage;
    //     page++;
    // }
    // const memberIdList = members.map(m => m.accountId);
    // fs.writeFileSync("cache/members.json", JSON.stringify(memberIdList, null, 4));

    // const memberIdList = JSON.parse(fs.readFileSync("cache/members.json"));

    // const dict = new playerDict();
    // dict.addPlayerIds(memberIdList);

    // //for each member in id list 5 at a time
    // const pageSize = 25
    // for (let i = 0; i < memberIdList.length; i += pageSize) {
    //     // for(let i = 0; i < 5; i += pageSize) {
    //     const slice = memberIdList.slice(i, i + pageSize);
    //     const nameData = await api.core.getPlayerDisplayNames(slice);
    //     for (let j = 0; j < nameData.length; j++) {
    //         const player = dict.playerDict[nameData[j].accountId];
    //         player.name = nameData[j].displayName;
    //     }

    //     const tagData = await api.core.getPlayerDisplayTags(slice);
    //     for (let j = 0; j < tagData.length; j++) {
    //         if (!tagData[j]) continue;
    //         const player = dict.playerDict[tagData[j].accountId];
    //         player.tag = tagData[j].displayTag;
    //     }

    //     const zoneData = await api.core.getPlayerZones(slice);
    //     for (let j = 0; j < zoneData.length; j++) {
    //         //null check
    //         if (!zoneData[j]) continue;
    //         const player = dict.playerDict[zoneData[j].accountId];
    //         player.zone = zoneDict[zoneData[j].zoneId];
    //     }
    // }
    // fs.writeFileSync("cache/playerDict.json", JSON.stringify(dict.playerDict, null, 4));

})();