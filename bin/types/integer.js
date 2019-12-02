"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IntegerType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || value.length <= 0 || !msg || typeof value !== 'string')
            return undefined;
        const integer = Number.parseInt(value);
        return integer;
    }
}
exports.default = IntegerType;
//# sourceMappingURL=integer.js.map