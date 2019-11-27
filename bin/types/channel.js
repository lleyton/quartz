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
        if (!value || !msg || !msg.channel.guild)
            return undefined;
        const match = value.match(/^(?:<#)?([0-9]+)>?$/);
        if (match) {
            try {
                const channel = msg.channel.guild.channels.get(match[1]);
                if (!channel)
                    return undefined;
                return channel;
            }
            catch (error) {
                return undefined;
            }
        }
        const search = value.toLowerCase();
        const channels = msg.channel.guild.channels.filter(filter(search));
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