"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Command Class */
class Command extends Base_1.default {
    constructor(client, options = {}) {
        super(client);
        const { name = '', aliases = [], args = [], channel = null, ownerOnly = false, guildOnly = true, devOnly = false, description = '', cooldown = {
            expires: 5000,
            command: 3
        }, botPermissions = this.botPermissions, userPermissions = this.userPermissions } = options;
        this.name = name;
        this.aliases = aliases;
        this.args = args;
        this.channel = channel;
        this.ownerOnly = Boolean(ownerOnly);
        this.guildOnly = Boolean(guildOnly);
        this.devOnly = Boolean(devOnly);
        this.description = description;
        this.cooldown = cooldown;
        this.botPermissions = typeof botPermissions === 'function' ? botPermissions.bind(this) : botPermissions;
        this.userPermissions = typeof userPermissions === 'function' ? userPermissions.bind(this) : userPermissions;
    }
    /**
     * Run when command called
     */
    run(_) {
        throw new Error(`${this.constructor.name}#run has not been implemented`);
    }
}
exports.default = Command;
//# sourceMappingURL=Command.js.map