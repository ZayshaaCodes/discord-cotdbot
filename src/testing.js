const { NadeoAuth } = require("./interop/NadeoAuth");
const { TmApi } = require("./interop/TmApi");


(async () => {

    const auth = new NadeoAuth();
    await auth.init();
    const api = new TmApi(auth);


    const samplePlayerIds = [
        "76f34c93-b0eb-446b-b212-60ffc35e317d",
        "90dc7c06-3fad-42ad-b92e-a230efb8f088",
        "e2f42d3d-873f-4706-bf37-636a6296c7f0",
        "7abbbb05-eca7-4df5-8644-29edd8d33f44"
    ]

    const clubId = "39343";
    const challengeId = "2620";
    const mapUids = [
        "7xgnMnxO5ariWbUHksrLLCDGPN1",
        "HVWPIUGFbtDTbQ6_r5bRL3MWWwj"
    ];

    const comps = await api.club.getCompetitionList(5);
    // console.log(comps);
    //get the compe with id of 5323
    const c = comps.find(c => c.id == 5323);
    console.log(c.name + " players: " + c.nbPlayers);

    //get the leaderboard for the first competition
    const leaderboard = await api.club.getCompetitionLeaderboard(c.id,64, 64);
    console.log(leaderboard);

    // //get then log the result of the promise
    // const data = await api.club.getCompetitionLeaderboard(2,0);


})();