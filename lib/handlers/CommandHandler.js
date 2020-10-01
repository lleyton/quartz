"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _client, _permissionHandler, _cooldownHandler;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ArgumentHandler_1 = __importDefault(require("./ArgumentHandler"));
const PermissionHandler_1 = __importDefault(require("./PermissionHandler"));
const CooldownHandler_1 = __importDefault(require("./CooldownHandler"));
/** CommandHandler Class */
class CommandHandler {
    /**
     * Create the commandHandler
     * @param {object} client - QuartzClient object
     * @param {object} options - commandHandler options
     */
    constructor(client, options) {
        _client.set(this, void 0);
        _permissionHandler.set(this, void 0);
        _cooldownHandler.set(this, void 0);
        if (!options) {
            options = {
                directory: './commands',
                prefix: '!',
                debug: false,
                defaultCooldown: 1000
            };
        }
        __classPrivateFieldSet(this, _client, client);
        this.directory = options.directory || './commands';
        this.debug = options.debug || false;
        this.defaultCooldown = options.defaultCooldown || 10000;
        this.commands = new Map();
        this.modules = new Map();
        this.aliases = new Map();
        __classPrivateFieldSet(this, _permissionHandler, new PermissionHandler_1.default(client));
        __classPrivateFieldSet(this, _cooldownHandler, new CooldownHandler_1.default(client));
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return __classPrivateFieldGet(this, _client);
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
        const files = (await fs_extra_1.readdir(`${this.directory}${path_1.sep}${module}`)).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
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
    async loadModules() {
        return (await fs_extra_1.readdir(this.directory)).filter(async (f) => (await fs_extra_1.stat(path_1.join(this.directory, f))).isDirectory());
    }
    /**
     * Load the commands from the folder
     */
    async loadCommands() {
        try {
            const modules = await this.loadModules();
            if (modules.length <= 0)
                throw new Error(`No category folders found in ${this.directory}`);
            await modules.map(async (module) => {
                const files = (await fs_extra_1.readdir(`${this.directory}${path_1.sep}${module}`)).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
                if (files.length <= 0)
                    throw new Error(`No files found in commands folder ${this.directory}${path_1.sep}${module}`);
                await files.map(async (file) => {
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
                        __classPrivateFieldGet(this, _client).logger.info(`Loading command ${cmd.name} from ${module}`);
                    if (cmd.aliases && cmd.aliases.length > 0)
                        await cmd.aliases.map((alias) => this.aliases.set(alias, cmd.name));
                });
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    /**
     * Runs commands
     * @param {object} context - The message object
     */
    async handleCommand(context) {
        try {
            if ((context.command.ownerOnly && context.message.author.id !== __classPrivateFieldGet(this, _client).owner) ||
                (context.message.channel.type !== 0 && context.message.channel.type !== 1) ||
                (context.command.guildOnly && context.message.channel.type !== 0))
                return;
            if (process.env.NODE_ENV !== 'development' && context.command.devOnly && context.message.author.id !== __classPrivateFieldGet(this, _client).owner)
                return context.message.channel.createMessage(`<@${context.message.author.id}>, **Currently Unavailable:** The bot is currently unavailable.`);
            if (context.message.channel.type === 0) {
                const channelPermissions = context.message.channel.permissionsOf(this.client.user.id);
                if (!channelPermissions.has('sendMessages'))
                    return;
                if (!channelPermissions.has('embedLinks'))
                    return await context.message.channel.createMessage(`${context.message.author.mention}, \`Embed Links\` is required for the bot to work!`);
                if (!await __classPrivateFieldGet(this, _permissionHandler).bot(context.message, context.command, channelPermissions))
                    return;
                if (!await __classPrivateFieldGet(this, _permissionHandler).user(context.message, context.command))
                    return;
            }
            if (context.command.cooldown && context.command.cooldown.expires && context.command.cooldown.command && context.message.author.id !== __classPrivateFieldGet(this, _client).owner)
                __classPrivateFieldGet(this, _cooldownHandler).check(context.message, context.command);
            const argumentHandler = new ArgumentHandler_1.default(this.client, context.command, context.arguments);
            const parsedArgs = await argumentHandler.parse(context.message);
            if (!parsedArgs)
                return;
            await context.command.run(context);
            if (this.debug)
                return __classPrivateFieldGet(this, _client).emit('commandRun', context);
            return;
        }
        catch (error) {
            return __classPrivateFieldGet(this, _client).logger.error(error);
        }
    }
}
_client = new WeakMap(), _permissionHandler = new WeakMap(), _cooldownHandler = new WeakMap();
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map