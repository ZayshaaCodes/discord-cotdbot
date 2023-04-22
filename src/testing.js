const { NadeoAuth } = require("./interop/NadeoAuth");
const { TmApi } = require("./interop/TmApi");
const { AppUtils } = require("./Utils");
const fs = require("fs");
const { playerDict } = require("./objects/PlayerLib");
const { json } = require("stream/consumers");
const ZoneCache = require("./ZoneCache");
const { log } = require("console");


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
    const challengeId = "2658";
    // const mapUids = [
    //     '7xgnMnxO5ariWbUHksrLLCDGPN1',
    //     'HVWPIUGFbtDTbQ6_r5bRL3MWWwj'
    // ];

    const zones = new ZoneCache();
    zones.loadFromJson();

    const data = await api.getCurrentCOTDChallengeData();

    log(data.challenge.name + " - " + data.map.name + " - " + data.map.mapUid);

})();

