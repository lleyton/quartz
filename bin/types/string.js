"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || !msg)
            return undefined;
        return value;
    }
}
exports.default = StringType;
//# sourceMappingURL=string.js.map