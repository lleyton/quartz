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
        var _a, _b, _c;
        if (!value || value.length <= 0 || !msg || !((_a = msg.member) === null || _a === void 0 ? void 0 : _a.guild) || typeof value !== 'string')
            return undefined;
        const match = value.match(/^(?:<@&)?([0-9]+)>?$/);
        if (match) {
            try {
                const user = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.guild.roles.get(match[1]);
                if (!user)
                    return undefined;
                return user;
            }
            catch (error) {
                return undefined;
            }
        }
        const search = value.toLowerCase();
        const roles = (_c = msg.member) === null || _c === void 0 ? void 0 : _c.guild.roles.filter(filter(search));
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