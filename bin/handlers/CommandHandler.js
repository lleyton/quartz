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
const Embed_1 = __importDefault(require("../structures/Embed"));
const fs_1 = require("fs");
const path_1 = require("path");
const eris_1 = require("eris");
const ArgumentHandler_1 = __importDefault(require("./ArgumentHandler"));
const types = ['user', 'string', 'channel', 'role', 'message', 'integer', 'float'];
/** CommandHandler Class */
class CommandHandler {
    /**
     * Create the commandHandler
     * @param {object} quartz - QuartzClient object
     * @param {object} options - commandHandler options
     */
    constructor(client, options) {
        if (!options)
            options = { directory: './commands', prefix: '!', debug: false, defaultCooldown: 1000, settings: null, text: 'Quartz', logo: '', color: 0xFFFFFF };
        this._client = client;
        this.directory = options.directory || './commands';
        this.debug = options.debug || false;
        this._prefix = options.prefix || '!';
        this.defaultCooldown = options.defaultCooldown || 10000;
        this.commands = new eris_1.Collection(null);
        this.modules = new eris_1.Collection(null);
        this.aliases = new eris_1.Collection(null);
        this.cooldowns = new eris_1.Collection(null);
        this._settings = options.settings || undefined;
        this._text = options.text || 'Quartz';
        this._logo = options.logo || '';
        this._color = options.color || 0xFFFFFF;
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
    /**
     * Get server settings
     * @param {object} msg - The message object
     * @return {object} The settings object
     */
    settings(msg) {
        if (typeof this._settings !== 'function')
            return this._settings;
        else
            return this._settings(msg);
    }
    /**
     * Get footer text
     * @param {object} msg - The message object
     * @return {string} The footer text
     */
    text(msg) {
        if (typeof this._text !== 'function')
            return this._text;
        else
            return this._text(msg);
    }
    /**
     * Get footer logo
     * @param {object} msg - The message object
     * @return {string} The footer logo
     */
    logo(msg) {
        if (typeof this._logo !== 'function')
            return this._logo;
        else
            return this._logo(msg);
    }
    /**
     * Get footer color
     * @param {object} msg - The message object
     * @return {string} The footer color
     */
    color(msg) {
        if (typeof this._color !== 'function')
            return this._color;
        else
            return this._color(msg);
    }
    /**
     * Get prefix
     * @param {object} msg - The message object
     * @return {string} The prefix
     */
    prefix(msg) {
        if (typeof this._prefix !== 'function')
            return this._prefix;
        else
            return this._prefix(msg);
    }
    /**
     * Return a embed
     * @param {string} message - The embed content
     * @param {object} options - The embed options
     * @return {object} The embed
     */
    async embed(msg, message, options) {
        const generateEmbed = new Embed_1.default();
        if (!options)
            options = { reply: false, bold: false, color: null, footer: false, text: false };
        if (options.reply && !options.bold)
            message = `<@${msg.author.id}>, ${message}`;
        else if (options.bold && !options.reply)
            message = `**${message}**`;
        else if (options.bold && options.reply)
            message = `**<@${msg.author.id}>, ${message}**`;
        if (options.text)
            return msg.channel.createMessage(message);
        generateEmbed.setDescription(message);
        if (options.color)
            generateEmbed.setColor(options.color);
        else
            generateEmbed.setColor(+await msg.color());
        if (options.footer)
            generateEmbed.setFooter(await msg.text(), await msg.logo());
        return msg.channel.createMessage({ embed: generateEmbed });
    }
    /**
     * Runs commands
     * @param {object} msg - The message object
     */
    async _onMessageCreate(msg) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!msg.author || msg.author.bot || !((_a = msg.member) === null || _a === void 0 ? void 0 : _a.guild))
            return;
        const prefix = await this.prefix(msg);
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const content = msg.content.toLowerCase();
        if (Array.isArray(prefix)) {
            prefix.forEach(p => escapeRegex(p));
            const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`);
            if (!prefixRegex.test(content))
                return undefined;
            const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
            if (!matchedPrefix)
                return undefined;
            msg.prefix = matchedPrefix;
        }
        else {
            const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`);
            if (!prefixRegex.test(content))
                return;
            const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
            if (!matchedPrefix)
                return;
            msg.prefix = matchedPrefix;
        }
        if (!msg.prefix)
            return;
        msg.content = msg.content.replace(/<@!/g, '<@');
        let args = msg.content.slice(msg.prefix.length).trim().split(/ +/);
        const label = args.shift().toLowerCase();
        const command = this.getCommand(label);
        if (!command)
            return;
        // @ts-ignore
        msg.command = command;
        msg.color = this.color.bind(this, msg);
        msg.logo = this.logo.bind(this, msg);
        msg.text = this.text.bind(this, msg);
        msg.embed = this.embed.bind(this, msg);
        msg.settings = this.settings.bind(this, msg);
        const parsedArgs = new ArgumentHandler_1.default(this.client, command, args).parse(msg);
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
            else if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.guild) {
                const botPermissions = (_c = msg.member) === null || _c === void 0 ? void 0 : _c.guild.members.get(this.client.user.id).permission;
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
        if (command.cooldown && command.cooldown.expires && command.cooldown.command) {
            const checkCooldown = this.cooldowns.get(msg.author.id);
            if (checkCooldown && checkCooldown.expires) {
                if (new Date(checkCooldown.expires) < new Date()) {
                    this.cooldowns.delete(msg.author.id);
                    this.cooldowns.set(msg.author.id, { expires: Date.now() + command.cooldown.expires, notified: false, command: 1 });
                    // @ts-ignore
                }
                else if (!checkCooldown.notified && checkCooldown.command >= msg.command.cooldown.command) {
                    checkCooldown.notified = true;
                    this.cooldowns.set(msg.author.id, checkCooldown);
                    return this._client.emit('ratelimited', msg, command, true, checkCooldown.expires);
                }
                else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
                    return this._client.emit('ratelimited', msg, command, false, checkCooldown.expires);
                }
                else {
                    // @ts-ignore
                    this.cooldowns.set(msg.author.id, { expires: Date.now() + msg.command.cooldown.expires, notified: false, command: ++checkCooldown.command });
                }
            }
            else {
                // @ts-ignore
                this.cooldowns.set(msg.author.id, { expires: Date.now() + msg.command.cooldown.expires, notified: false, command: 1 });
            }
        }
        if (command.guildOnly && !((_d = msg.member) === null || _d === void 0 ? void 0 : _d.guild))
            return;
        if ((_e = msg.member) === null || _e === void 0 ? void 0 : _e.guild)
            msg.guild = (_f = msg.member) === null || _f === void 0 ? void 0 : _f.guild;
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
            else if ((_g = msg.member) === null || _g === void 0 ? void 0 : _g.guild) {
                const perm = msg.member.permission.has(command.userPermissions);
                if (!perm) {
                    this._client.emit('missingPermission', msg, command, command.userPermissions);
                    return;
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
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map