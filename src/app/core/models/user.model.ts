export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _refreshToken: string
    ) { }

    get token() {
        return this._token;
    }

    get refreshToken() {
        return this._refreshToken;
    }
}