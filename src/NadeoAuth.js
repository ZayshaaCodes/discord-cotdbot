class AuthToken {
    constructor(accessToken, refreshToken, expires) {
        this.accessToken = accessToken;
        this.expires = expires;
        this.refreshToken = refreshToken;
    }

    isExpired() {
        return this.expires < new Date();
    }

    async refreshAccessToken() {
        const response = await fetch(
            "https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh",
            {
                method: "POST",
                headers: {
                    Authorization: `nadeo_v1 t=${this.refreshToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.statusText}`);
        }

        const data = await response.json();
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.expires = new Date(data.expires);
    }

    static fromJSON(json) {
        return new AuthToken(json.accessToken, json.refreshToken, json.expires);
    }
}

class NadeoAuth {
    constructor(email, password) {
        this.email = email;
        this.password = password;

        this.ubiToken = null;

        this.nadeoServicesToken = null;
        this.nadeoClubServicesToken = null;
        this.nadeoLiveServicesToken = null;
    }

    //connect to the nadeo api
    async init() {
        console.log("init auth tokens");
        this.ubiToken = await this.getUbiToken(this.email, this.password);
        this.nadeoServicesToken = await this.getAuthForAudience("NadeoServices");
        this.nadeoClubServicesToken = await this.getAuthForAudience("NadeoClubServices");
        this.nadeoLiveServicesToken = await this.getAuthForAudience("NadeoLiveServices");
    }

    // deserialize from an json object
    static fromJSON(json) {
        console.log("Loaded tokens from json");
        const auth = new NadeoAuth(json.email, json.password);
        auth.ubiToken = json.ubiToken;
        auth.nadeoServicesToken = AuthToken.fromJSON(json.nadeoServicesToken);
        auth.nadeoClubServicesToken = AuthToken.fromJSON(json.nadeoClubServicesToken);
        auth.nadeoLiveServicesToken = AuthToken.fromJSON(json.nadeoLiveServicesToken);
        return auth;
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
                    "User-Agent": "My amazing app / my.email.address@example.com",
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

    // get core services token
    async getNadeoServicesToken() {
        if (this.nadeoServicesToken.isExpired()) {
            await this.nadeoServicesToken.refreshAccessToken();
        }

        return this.nadeoServicesToken.accessToken;
    }

    // get club services token
    async getNadeoClubServicesToken() {
        if (this.nadeoClubServicesToken.isExpired()) {
            await this.nadeoClubServicesToken.refreshAccessToken();
        }

        return this.nadeoClubServicesToken.accessToken;
    }

    // get live services token
    async getNadeoLiveServicesToken() {
        if (this.nadeoLiveServicesToken.isExpired()) {
            await this.nadeoLiveServicesToken.refreshAccessToken();
        }

        return this.nadeoLiveServicesToken.accessToken;
    }



    async getAuthForAudience(audience) {

        // get the auth and refresh token for an audience
        const tokenResponse = await fetch(
            "https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `ubi_v1 t=${this.ubiToken}`,
                },
                body: JSON.stringify({ audience: audience }),
            }
        );

        if (!tokenResponse.ok) {
            throw new Error(`Token request failed: ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();

        //parse the jwt token to get the expiration date
        const payload = NadeoAuth.parseJwt(tokenData.accessToken);

        const newtoken = new AuthToken(tokenData.accessToken, tokenData.refreshToken, new Date(payload.exp * 1000));
        console.log(`Got new token for ${audience} expires ${newtoken.expires}`);

        return newtoken;
    }

    //extract the payload from a jwt token
    static parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = JSON.parse(atob(base64));

        return jsonPayload;
    }



}

module.exports = { NadeoAuth };