"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || value.length <= 0 || !msg || typeof value !== 'string')
            return undefined;
        return msg.channel.messages.get(value) || undefined;
    }
}
exports.default = MessageType;
//# sourceMappingURL=message.js.map