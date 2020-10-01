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
var _client;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const eris_1 = require("eris");
const util_1 = __importDefault(require("util"));
const quartzEvents = ['missingPermission', 'commandRun', 'ratelimited'];
const getPrefix = (msg, _prefix) => {
    if (typeof _prefix === 'function') {
        if (util_1.default.types.isAsyncFunction(_prefix)) {
            return _prefix(msg)
                .then((prefix) => prefix || '!')
                .catch((error) => {
                throw new Error(error.message);
            });
        }
        return _prefix(msg);
    }
    else
        return _prefix;
};
/** EventHandler Class */
class EventHandler {
    /**
     * Create the eventHandler
     * @param {object} client - QuartzClient object
     * @param {object} options - eventHandler options
     */
    constructor(client, options = {
        directory: './commands',
        debug: false
    }) {
        _client.set(this, void 0);
        __classPrivateFieldSet(this, _client, client);
        this.directory = options.directory;
        this.debug = options.debug;
        this.events = new eris_1.Collection(null);
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return __classPrivateFieldGet(this, _client);
    }
    /**
     * Load the events from the folder
     */
    async loadEvents() {
        const files = (await fs_extra_1.readdir(this.directory))
            .filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
        if (files.length <= 0)
            throw new Error(`No files found in events folder '${this.directory}'`);
        files.map(async (file) => {
            let Event = await Promise.resolve().then(() => __importStar(require(path_1.resolve(`${this.directory}${path_1.sep}${file}`))));
            if (typeof Event !== 'function')
                Event = Event.default;
            const evt = new Event(this.client);
            if (!evt)
                throw new Error(`Event ${this.directory}${path_1.sep}${file} file is empty`);
            if (!evt.name)
                throw new Error(`Event ${this.directory}${path_1.sep}${file} is missing a name`);
            if (this.events.get(evt.name))
                throw new Error(`Event ${this.directory}${path_1.sep}${file} already exists`);
            this.events.set(evt.name, evt);
            if (this.debug)
                __classPrivateFieldGet(this, _client).logger.info(`Loading event ${evt.name}`);
            if (quartzEvents.includes(evt.name))
                __classPrivateFieldGet(this, _client).on(evt.name, evt.run.bind(this));
            else if (evt.name === 'messageCreate')
                return undefined;
            else if (evt.name === 'ready')
                this.client.once(evt.name, evt.run.bind(this));
            else
                this.client.on(evt.name, evt.run.bind(this));
        });
    }
    /**
     * Runs event
     * @param {object} msg - The message object
     */
    async _onMessageCreate(msg) {
        try {
            if (!msg.author || msg.author.bot)
                return;
            const context = {
                message: msg
            };
            const prefix = await getPrefix(msg, this.client._options.commandHandler.prefix);
            const content = msg.content.toLowerCase();
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (Array.isArray(prefix)) {
                if (prefix.length <= 0)
                    msg.prefix = null;
                else {
                    prefix.forEach((p) => escapeRegex(p));
                    const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`);
                    const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                    if (matchedPrefix)
                        context.prefix = matchedPrefix;
                }
            }
            else if (prefix) {
                const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`);
                const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                if (matchedPrefix)
                    context.prefix = matchedPrefix;
            }
            if (context.prefix) {
                const args = msg.content.substring(context.prefix.length).split(' ');
                context.arguments = args;
                const label = args.shift().toLowerCase();
                const command = await __classPrivateFieldGet(this, _client).commandHandler.getCommand(label);
                if (command) {
                    context.command = command;
                    await __classPrivateFieldGet(this, _client).commandHandler.handleCommand({
                        message: context.message,
                        command: context.command,
                        prefix: context.prefix,
                        arguments: context.arguments
                    });
                }
            }
            if ((__classPrivateFieldGet(this, _client)._options.eventHandler.commands && msg.command) || !msg.command) {
                const event = this.events.get('messageCreate');
                return event.run.call(this, msg);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
_client = new WeakMap();
exports.default = EventHandler;
//# sourceMappingURL=EventHandler.js.map