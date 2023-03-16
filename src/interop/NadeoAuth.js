const fs = require('fs');

class AuthToken {
    constructor(audience) {
        this.audience = audience;
        this.accessToken = null;
        this.expires = 0;
        this.refreshToken = null;
        this.refreshExpires = 0;
    }

    isExpired() {
        let date = (new Date()).getTime();
        return date > this.expires;
    }

    isExpiredRefresh() {
        let date = (new Date()).getTime();
        return date > this.refreshExpires;
    }

    async token() {
        if (this.isExpired()) {
            await this.refreshAccessToken();
        }
        return this.accessToken;
    }

    async initAuthForAudience(audience, ubiToken) {

        // get the auth and refresh token for an audience
        const tokenResponse = await fetch(
            "https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `ubi_v1 t=${ubiToken}`,
                },
                body: JSON.stringify({ audience: audience }),
            }
        );

        if (!tokenResponse.ok) {
            throw new Error(`Token request failed: ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();

        this.accessToken = tokenData.accessToken;
        this.expires = getJwtExp(this.accessToken);

        this.refreshToken = tokenData.refreshToken;
        this.refreshExpires = getJwtExp(this.refreshToken);

        console.log(`Got new token for ${audience} expires in ${new Date(this.expires - new Date()).toISOString().substr(11, 8)}`);
        // console.log(`Got new token for ${audience} refresh in ${new Date(this.refreshExpires - new Date()).toISOString().substr(11, 8)}`);
    }

    async refreshAccessToken(ubiToken) {
        if (this.isExpiredRefresh()) {
            console.log(this.audience + "refresh token expired, getting new one");
            await this.initAuthForAudience(this.audience, ubiToken);
            return
        }

        const response = await fetch(
            "https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh",
            {
                method: "POST",
                headers: {
                    Authorization: `nadeo_v1 t=${this.refreshToken}`,
                },
            }
        )
        if (!response.ok) {
            throw new Error(`Refresh token request failed: ${response.statusText}`);
        }

        const data = await response.json();
        this.accessToken = data.accessToken;
        this.expires = getJwtExp(this.accessToken);
    }

    static fromJSON(json) {
        const token = new AuthToken(json.audience);
        token.accessToken = json.accessToken;
        token.expires = json.expires;
        token.refreshToken = json.refreshToken;
        token.refreshExpires = json.refreshExpires;
        return token;
    }
}

class NadeoAuth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.Tokens = {};
    }

    //connect to the nadeo api
    async init() {

        //try to load tokens from file
        if (await this.loadTokens()) {
            console.log("loaded tokens from file");
            // for each key in tokens
            let doSave = false;
            for (const key of Object.keys(this.Tokens)) {
                //if key is not UbiServices
                if (key !== "UbiServices") {
                    //if token is expired, refresh it
                    if (this.Tokens[key].isExpired()) {
                        console.log(this.Tokens[key].audience + "token expired, refreshing");
                        await this.Tokens[key].refreshAccessToken(this.Tokens["UbiServices"]);
                        doSave = true;
                    }
                }
            }
            if (doSave) this.saveTokens();
        } else {
            console.log("no tokens found, getting new ones");
            await this.getNewTokens();
        }


    }

    async loadTokens() {
        //if init.json exists, deserialize it into a nadeo auth object
        if (fs.existsSync("cache/tokens.json")) {
            const data = fs.readFileSync("cache/tokens.json");
            const jsonData = JSON.parse(data);

            //foreach key in the jsondata
            for (const key of Object.keys(jsonData)) {
                if (key === "UbiServices") {
                    this.Tokens[key] = jsonData[key];
                    //log payload
                    // console.log(getJwtPayload(this.Tokens[key]));

                } else {
                    const token = AuthToken.fromJSON(jsonData[key]);
                    this.Tokens[token.audience] = token;
                }

            }
            return true;
        }
        return false;
    }


    async getNewTokens() {

        this.Tokens = {};

        const ubi = await this.getUbiToken(this.email, this.password);
        this.Tokens["UbiServices"] = ubi;

        for (const audience of ["NadeoServices", "NadeoClubServices", "NadeoLiveServices"]) {
            let token = new AuthToken(audience);
            await token.initAuthForAudience(audience, ubi);
            this.Tokens[audience] = token;
        }


        this.saveTokens();
    }

    saveTokens() {
        fs.writeFileSync("cache/tokens.json", JSON.stringify(this.Tokens));
    }

    //get the auth token for the current user
    async getUbiToken(user, pw) {
        const authResponse = await fetch(
            "https://public-ubiservices.ubi.com/v3/profiles/sessions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Ubi-AppId": "86263886-327a-4328-ac69-527f0d20a237",
                    Authorization: `Basic ${btoa(`${user}:${pw}`)}`,
                    "User-Agent": `discord cotd bot / ${user}`,
                },
            }
        );

        if (!authResponse.ok) {
            throw new Error(`Authentication failed: ${authResponse.statusText}`);
        }

        const authData = await authResponse.json();
        const ticket = authData.ticket;

        return ticket;
    }

    async getNadeoServicesToken() {

        return this.Tokens["NadeoServices"].token();
    }

    async getNadeoClubServicesToken() {
        return this.Tokens["NadeoClubServices"].token();
    }

    async getNadeoLiveServicesToken() {
        return this.Tokens["NadeoLiveServices"].token();
    }


}

//extract the payload from a jwt token
function getJwtPayload(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(atob(base64));

    return jsonPayload;
}

//get exp date from jwt token
function getJwtExp(token) {
    const payload = getJwtPayload(token);
    return payload.exp * 1000;
}


module.exports = { NadeoAuth };