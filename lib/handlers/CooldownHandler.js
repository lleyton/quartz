"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _client;
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
class CooldownHandler {
    constructor(client) {
        _client.set(this, void 0);
        this.cooldowns = new eris_1.Collection(undefined, 100);
        __classPrivateFieldSet(this, _client, client);
    }
    check(msg, command) {
        const checkCooldown = this.cooldowns.get(msg.author.id);
        if (checkCooldown === null || checkCooldown === void 0 ? void 0 : checkCooldown.expires) {
            if (new Date(checkCooldown.expires) < new Date()) {
                this.cooldowns.delete(msg.author.id);
                this.cooldowns.set(msg.author.id, {
                    expires: Date.now() + command.cooldown.expires,
                    notified: false,
                    command: 1
                });
            }
            else if (!checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
                checkCooldown.notified = true;
                this.cooldowns.set(msg.author.id, checkCooldown);
                return __classPrivateFieldGet(this, _client).emit('ratelimited', msg, command, true, checkCooldown.expires);
            }
            else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command)
                return __classPrivateFieldGet(this, _client).emit('ratelimited', msg, command, false, checkCooldown.expires);
            else {
                this.cooldowns.set(msg.author.id, {
                    expires: Date.now() + Number(command.cooldown.expires),
                    notified: false,
                    command: checkCooldown.command
                });
            }
        }
        else {
            this.cooldowns.set(msg.author.id, {
                expires: Date.now() + Number(command.cooldown.expires),
                notified: false,
                command: 1
            });
        }
    }
}
_client = new WeakMap();
exports.default = CooldownHandler;
//# sourceMappingURL=CooldownHandler.js.map