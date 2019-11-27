"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter = (search) => {
    return (role) => role.name.toLowerCase() === search;
};
class RoleType {
    constructor(client) {
        this.client = client;
    }
    parse(value, msg) {
        if (!value || !msg || !msg.channel.guild)
            return undefined;
        const match = value.match(/^(?:<@&)?([0-9]+)>?$/);
        if (match) {
            try {
                const user = msg.channel.guild.roles.get(match[1]);
                if (!user)
                    return undefined;
                return user;
            }
            catch (error) {
                return undefined;
            }
        }
        const search = value.toLowerCase();
        const roles = msg.channel.guild.roles.filter(filter(search));
        if (roles.length === 0)
            return undefined;
        if (roles.length === 1)
            return roles[0];
        if (roles.length > 1) {
            return 'More then one user found. Be more specific.';
        }
    }
}
exports.default = RoleType;
//# sourceMappingURL=role.js.map