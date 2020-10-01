"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Base Class */
class Base {
    /**
     * Create the eventHandler
     * @param {object} client - QuartzClient object
     */
    constructor(client) {
        this._client = client;
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._client;
    }
    /**
     * Get the logger object
     * @return {object} The logger object.
     */
    get logger() {
        return this._client.logger;
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map