"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter = (search) => {
    return (channel) => channel.name.toLowerCase() === search;
};
class ChannelType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        var _a, _b, _c;
        if (!value || value.length <= 0 || !msg || !((_a = msg.member) === null || _a === void 0 ? void 0 : _a.guild) || typeof value !== 'string')
            return undefined;
        const match = value.match(/^(?:<#)?([0-9]+)>?$/);
        if (match) {
            try {
                const channel = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.guild.channels.get(match[1]);
                if (!channel)
                    return undefined;
                return channel;
            }
            catch (error) {
                return undefined;
            }
        }
        const search = value.toLowerCase();
        const channels = (_c = msg.member) === null || _c === void 0 ? void 0 : _c.guild.channels.filter(filter(search));
        if (channels.length === 0)
            return undefined;
        if (channels.length === 1)
            return channels[0];
        if (channels.length > 1) {
            return 'More then one channel found. Be more specific.';
        }
    }
}
exports.default = ChannelType;
//# sourceMappingURL=channel.js.map