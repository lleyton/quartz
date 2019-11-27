"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Base Class */
class Base {
    constructor(quartzClient) {
        this._quartz = quartzClient;
    }
    /**
     * Get the quartz client object
     * @return {object} The quartz client object.
     */
    get quartz() {
        return this._quartz;
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._quartz.client;
    }
    /**
     * Get the logger object
     * @return {object} The logger object.
     */
    get logger() {
        return this._quartz.logger;
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map