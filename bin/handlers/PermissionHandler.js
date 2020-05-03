"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionHandler {
    constructor(client) {
        this._client = client;
    }
    async bot(msg, command, channelPermissions) {
        var _a, _b;
        if (!command.botPermissions)
            return true;
        if (typeof command.botPermissions === 'function') {
            const missing = await command.botPermissions(msg);
            if (missing != null) {
                this._client.emit('missingPermission', msg, command, missing, true);
                return false;
            }
            return true;
        }
        else if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.guild) {
            const botPermissions = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.guild.members.get(this._client.user.id).permission;
            if (command.botPermissions instanceof Array) {
                const hasPermission = command.botPermissions.some((permission) => botPermissions.has(permission) || channelPermissions.has(permission));
                if (!hasPermission) {
                    this._client.emit('missingPermission', msg, command, command.botPermissions, true);
                    return false;
                }
            }
            else {
                if (!botPermissions.has(command.botPermissions) && !channelPermissions.has(command.botPermissions)) {
                    this._client.emit('missingPermission', msg, command, command.botPermissions);
                    return false;
                }
            }
            return true;
        }
    }
    async user(msg, command) {
        var _a, _b;
        if (!command.userPermissions)
            return true;
        if (typeof command.userPermissions === 'function') {
            const missing = await command.userPermissions(msg);
            if (missing) {
                if (missing !== 'ignore')
                    this._client.emit('missingPermission', msg, command, missing, false);
                return false;
            }
            return true;
        }
        else if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.guild) {
            if (Array.isArray(command.userPermissions)) {
                const userPermissions = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.permission;
                const hasPermission = command.userPermissions.some((permission) => userPermissions.has(permission));
                if (!hasPermission) {
                    this._client.emit('missingPermission', msg, command, command.userPermissions, false);
                    return false;
                }
            }
            else {
                const permission = msg.member.permission.has(command.userPermissions);
                if (!permission) {
                    this._client.emit('missingPermission', msg, command, command.userPermissions, false);
                    return false;
                }
            }
            return true;
        }
    }
}
exports.default = PermissionHandler;
//# sourceMappingURL=PermissionHandler.js.map