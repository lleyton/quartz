"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const eris_1 = require("eris");
const ArgumentHandler_1 = __importDefault(require("./ArgumentHandler"));
const Message_1 = __importDefault(require("../structures/Message"));
/** CommandHandler Class */
class CommandHandler {
    /**
     * Create the commandHandler
     * @param {object} client - QuartzClient object
     * @param {object} options - commandHandler options
     */
    constructor(client, options) {
        if (!options)
            options = { directory: './commands', prefix: '!', debug: false, defaultCooldown: 1000, settings: null, text: 'Quartz', logo: '', color: 0xFFFFFF };
        this._client = client;
        this.directory = options.directory || './commands';
        this.debug = options.debug || false;
        this.defaultCooldown = options.defaultCooldown || 10000;
        this.commands = new eris_1.Collection(undefined);
        this.modules = new eris_1.Collection(undefined);
        this.aliases = new eris_1.Collection(undefined);
        this.cooldowns = new eris_1.Collection(undefined);
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._client;
    }
    /**
     * Get command by name
     * @param {string} commandName - The command name.
     * @return {object} The commands object
     */
    getCommand(commandName) {
        if (!commandName)
            return undefined;
        let cmd = this.commands.get(commandName);
        if (!cmd) {
            const alias = this.aliases.get(commandName);
            if (!alias)
                return null;
            cmd = this.commands.get(alias);
        }
        return cmd;
    }
    /**
     * Get the commands from module
     * @param {string} module - The module folder.
     * @return {array} The commands in module.
     */
    async getCommands(module) {
        const files = await fs_1.readdirSync(`${this.directory}${path_1.sep}${module}`).filter(f => f.endsWith('.js'));
        if (files.length <= 0)
            throw new Error(`No files found in commands folder '${this.directory}'`);
        return files.map(file => {
            const commandName = file.replace(/\.[^/.]+$/, '');
            return this.getCommand(commandName);
        });
    }
    /**
     * Get the modules from the command folder
     * @return {array} The modules in the command folder
     */
    loadModules() {
        return fs_1.readdirSync(this.directory).filter(f => fs_1.statSync(path_1.join(this.directory, f)).isDirectory());
    }
    /**
     * Load the commands from the folder
     */
    async loadCommands() {
        try {
            const modules = this.loadModules();
            if (modules.length <= 0)
                throw new Error(`No category folders found in ${this.directory}`);
            await modules.forEach(async (module) => {
                const files = await fs_1.readdirSync(`${this.directory}${path_1.sep}${module}`).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
                if (files.length <= 0)
                    throw new Error(`No files found in commands folder ${this.directory}${path_1.sep}${module}`);
                await files.forEach(async (file) => {
                    let Command = await Promise.resolve().then(() => __importStar(require(path_1.resolve(`${this.directory}${path_1.sep}${module}${path_1.sep}${file}`))));
                    if (typeof Command !== 'function')
                        Command = Command.default;
                    const cmd = new Command(this.client);
                    if (!cmd || !cmd.name)
                        throw new Error(`Command ${this.directory}${path_1.sep}${module}${path_1.sep}${file} is missing a name`);
                    if (this.commands.get(cmd.name.toLowerCase()))
                        throw new Error(`Command ${cmd.name} already exists`);
                    await cmd.aliases.forEach((alias) => {
                        if (this.aliases.get(alias))
                            throw new Error(`Alias '${alias}' of '${cmd.name}' already exists`);
                    });
                    this.commands.set(cmd.name.toLowerCase(), cmd);
                    this.modules.set(cmd.name, module);
                    if (this.debug)
                        this._client.logger.info(`Loading command ${cmd.name} from ${module}`);
                    if (cmd.aliases && cmd.aliases.length > 0)
                        await cmd.aliases.forEach((alias) => this.aliases.set(alias, cmd.name));
                });
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    /**
     * Runs commands
     * @param {object} msg - The message object
     */
    async _onMessageCreate(_msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            if (!_msg.author || _msg.author.bot || !((_a = _msg.member) === null || _a === void 0 ? void 0 : _a.guild))
                return;
            const msg = new Message_1.default(_msg, this.client);
            await msg._configure();
            const content = msg.content.toLowerCase();
            if (Array.isArray(msg === null || msg === void 0 ? void 0 : msg.prefix)) {
                if (msg.prefix.length <= 0)
                    msg.prefix = null;
                else {
                    const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${((_b = msg === null || msg === void 0 ? void 0 : msg.prefix) === null || _b === void 0 ? void 0 : _b.join('|')) || '!'})\\s*`);
                    if (!prefixRegex.test(content))
                        return undefined;
                    const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                    if (!matchedPrefix)
                        return undefined;
                    msg.prefix = matchedPrefix;
                }
            }
            else if (msg.prefix) {
                const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${((_c = msg === null || msg === void 0 ? void 0 : msg.prefix) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '!'})\\s*`);
                if (!prefixRegex.test(content))
                    return;
                const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                if (!matchedPrefix)
                    return;
                msg.prefix = matchedPrefix;
            }
            if (!msg.prefix)
                return;
            const args = ((_d = msg === null || msg === void 0 ? void 0 : msg.cleanContent) === null || _d === void 0 ? void 0 : _d.slice(msg.prefix.length).trim().split(/ +/)) || ((_e = msg === null || msg === void 0 ? void 0 : msg.content) === null || _e === void 0 ? void 0 : _e.slice(msg.prefix.length).trim().split(/ +/));
            const label = args.shift().toLowerCase();
            const command = this.getCommand(label);
            if (!command)
                return;
            // @ts-ignore
            msg.command = command;
            const argumentHandler = new ArgumentHandler_1.default(this.client, command, args);
            const parsedArgs = await argumentHandler.parse(msg);
            if (!parsedArgs)
                return;
            // @ts-ignore
            const channelPermissions = msg.channel.permissionsOf(this.client.user.id);
            if (!channelPermissions.has('sendMessages') || !channelPermissions.has('embedLinks'))
                return;
            if (command.botPermissions) {
                if (typeof command.botPermissions === 'function') {
                    const missing = await command.botPermissions(msg);
                    if (missing != null)
                        return this._client.emit('missingPermission', msg, command, missing);
                }
                else if ((_f = msg.member) === null || _f === void 0 ? void 0 : _f.guild) {
                    const botPermissions = (_g = msg.member) === null || _g === void 0 ? void 0 : _g.guild.members.get(this.client.user.id).permission;
                    if (command.botPermissions instanceof Array) {
                        for (const p of command.botPermissions) {
                            if (!botPermissions.has(p))
                                return this._client.emit('missingPermission', msg, command, p);
                        }
                    }
                    else {
                        if (!botPermissions.has(command.botPermissions))
                            return this._client.emit('missingPermission', msg, command, command.botPermissions);
                    }
                }
            }
            if (command.cooldown && command.cooldown.expires && command.cooldown.command && msg.author.id !== this._client.owner) {
                const checkCooldown = this.cooldowns.get(msg.author.id);
                if (checkCooldown === null || checkCooldown === void 0 ? void 0 : checkCooldown.expires) {
                    if (new Date(checkCooldown.expires) < new Date()) {
                        this.cooldowns.delete(msg.author.id);
                        this.cooldowns.set(msg.author.id, { expires: Date.now() + command.cooldown.expires, notified: false, command: 1 });
                    }
                    else if (!checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
                        checkCooldown.notified = true;
                        this.cooldowns.set(msg.author.id, checkCooldown);
                        return this._client.emit('ratelimited', msg, command, true, checkCooldown.expires);
                    }
                    else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
                        return this._client.emit('ratelimited', msg, command, false, checkCooldown.expires);
                    }
                    else {
                        this.cooldowns.set(msg.author.id, { expires: Date.now() + Number(command.cooldown.expires), notified: false, command: ++checkCooldown.command });
                    }
                }
                else {
                    this.cooldowns.set(msg.author.id, { expires: Date.now() + Number(command.cooldown.expires), notified: false, command: 1 });
                }
            }
            if (command.guildOnly && !((_h = msg.member) === null || _h === void 0 ? void 0 : _h.guild))
                return;
            if ((_j = msg.member) === null || _j === void 0 ? void 0 : _j.guild)
                msg.guild = (_k = msg.member) === null || _k === void 0 ? void 0 : _k.guild;
            if (command.ownerOnly && msg.author.id !== this._client.owner)
                return;
            if (process.env.NODE_ENV !== 'development' && command.devOnly && msg.author.id !== this._client.owner)
                return this.client.embeds.embed(msg, `<@${msg.author.id}>, **Currently Unavailable:** The bot is currently unavailable.`);
            if (command.userPermissions) {
                if (typeof command.userPermissions === 'function') {
                    const missing = await command.userPermissions(msg);
                    if (missing != null) {
                        this._client.emit('missingPermission', msg, command, missing);
                        return;
                    }
                }
                else if ((_l = msg.member) === null || _l === void 0 ? void 0 : _l.guild) {
                    if (Array.isArray(command.userPermissions)) {
                        command.userPermissions.forEach((userPermission) => {
                            const permission = msg.member.permission.has(userPermission);
                            if (!permission)
                                return this._client.emit('missingPermission', msg, command, userPermission);
                        });
                    }
                    else {
                        const permission = msg.member.permission.has(command.userPermissions);
                        if (!permission)
                            return this._client.emit('missingPermission', msg, command, command.userPermissions);
                    }
                }
            }
            // @ts-ignore
            await command.run(msg, parsedArgs || args)
                .then(() => {
                return this._client.emit('commandRun', msg, command);
            })
                .catch((error) => {
                return this._client.logger.error(error);
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map