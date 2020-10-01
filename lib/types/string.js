"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || value.length <= 0 || !msg || typeof value !== 'string')
            return undefined;
        return value;
    }
}
exports.default = StringType;
//# sourceMappingURL=string.js.map