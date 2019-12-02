"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FloatType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || value.length <= 0 || !msg || typeof value !== 'string')
            return undefined;
        const float = Number.parseFloat(value);
        return float;
    }
}
exports.default = FloatType;
//# sourceMappingURL=float.js.map