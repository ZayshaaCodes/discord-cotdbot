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
        let flag = new Date() > this.expires;
        return flag;
    }

    isExpiredRefresh() {
        let flag = new Date() > this.refreshExpires;
        return flag;
    }

    async token(){
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
            console.log( this.audience + "refresh token expired, getting new one");
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
        this.ubiToken = null;
        this.Tokens = {};
    }

    //connect to the nadeo api
    async init() {

        this.ubiToken = await this.getUbiToken(this.email, this.password);

        //try to load tokens from file
        if (await this.loadTokens()) {
            console.log("loaded tokens from file");
            for (const token of Object.values(this.Tokens)) {
                if (token.isExpired()) {
                    console.log(token.audience + "token expired, refreshing");
                    await token.refreshAccessToken(this.ubiToken);
                }
            }

        } else {
            console.log("no tokens found, getting new ones");
            await this.getNewTokens();
        }


    }

    async loadTokens() {
        //if init.json exists, deserialize it into a nadeo auth object
        if (fs.existsSync("src/tokens.json")) {
            const data = fs.readFileSync("src/tokens.json");
            const jsonData = JSON.parse(data);

            for (const token of Object.values(jsonData)) {
                this.Tokens[token.audience] = AuthToken.fromJSON(token);
            }
            return true;
        }
        return false;
    }

    saveTokens() {
        fs.writeFileSync("src/tokens.json", JSON.stringify(this.Tokens));
    }

    async getNewTokens() {

        this.Tokens = {};

        for (const audience of ["NadeoServices", "NadeoClubServices", "NadeoLiveServices"]) {
            let token = new AuthToken(audience);
            await token.initAuthForAudience(audience, this.ubiToken);
            this.Tokens[audience] = token;
        }

        this.saveTokens();
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
                    "audience": this.audience,
                },
            }
        );

        if (!authResponse.ok) {
            throw new Error(`Authentication failed: ${authResponse.statusText}`);
        }

        const authData = await authResponse.json();
        return authData.ticket;
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
    return new Date(payload.exp * 1000);
}


module.exports = { NadeoAuth };