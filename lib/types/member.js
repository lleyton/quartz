"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter = (search) => {
    return (member) => member.user.username.toLowerCase() === search || (member.nick && member.nick.toLowerCase() === search) || `${member.user.username.toLowerCase()}#${member.user.discriminator}` === search;
};
class MemberType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || value.length <= 0 || !msg || typeof value !== 'string')
            return undefined;
        const match = value.match(/^(?:<@!?)?([0-9]+)>?$/);
        if (match) {
            try {
                const member = msg.member.guild.members.get(match[1]);
                if (!member)
                    return undefined;
                return member;
            }
            catch (error) {
                return undefined;
            }
        }
        if (!msg.member.guild)
            return undefined;
        const search = value.toLowerCase();
        const members = msg.member.guild.members.filter(filter(search));
        if (members.length === 0)
            return undefined;
        if (members.length === 1)
            return members[0];
        if (members.length > 1) {
            return 'More then one member found. Be more specific.';
        }
    }
}
exports.default = MemberType;
//# sourceMappingURL=member.js.map