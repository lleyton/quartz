"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || !msg)
            return undefined;
        return msg.channel.messages.get(value) || undefined;
    }
}
exports.default = MessageType;
//# sourceMappingURL=message.js.map