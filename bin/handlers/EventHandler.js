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
const path_1 = require("path");
const fs_1 = require("fs");
const eris_1 = require("eris");
const Message_1 = __importDefault(require("../structures/Message"));
const quartzEvents = ['missingPermission', 'commandRun', 'ratelimited'];
/** EventHandler Class */
class EventHandler {
    /**
     * Create the eventHandler
     * @param {object} quartz - QuartzClient object
     * @param {object} options - eventHandler options
     */
    constructor(client, options = { directory: './commands', debug: false }) {
        this._client = client;
        this.directory = options.directory;
        this.debug = options.debug;
        this.events = new eris_1.Collection(null);
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._client;
    }
    /**
     * Load the events from the folder
     */
    async loadEvents() {
        const files = await fs_1.readdirSync(this.directory)
            .filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
        if (files.length <= 0)
            throw new Error(`No files found in events folder '${this.directory}'`);
        files.forEach(async (file) => {
            // thing is, i tried on alpha the thing and it didn't even have the ready event ill send pic on dsicord
            let Event = await Promise.resolve().then(() => __importStar(require(path_1.resolve(`${this.directory}${path_1.sep}${file}`)))); // The easiest way to fix it would be to log each file by its name, then see if your ready events keeps on being loaded.
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
                this._client.logger.info(`Loading event ${evt.name}`);
            if (quartzEvents.includes(evt.name))
                this._client.on(evt.name, evt.run.bind(this));
            else if (evt.name === 'messageCreate')
                return undefined;
            else if (evt.name === 'ready')
                this.client.once(evt.name, evt.run.bind(this));
            else
                this.client.on(evt.name, evt.run.bind(this));
        }); // what did you say about the evt.run.bind(this) thing. what shoul di replace it with?
    }
    /**
     * Runs event
     * @param {object} msg - The message object
     */
    async _onMessageCreate(_msg) {
        try {
            if (!_msg.author || _msg.author.bot)
                return;
            const msg = new Message_1.default(_msg, this.client);
            await msg._configure();
            msg.command = null;
            const content = msg.content.toLowerCase();
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (Array.isArray(msg === null || msg === void 0 ? void 0 : msg.prefix)) {
                if (msg.prefix.length <= 0)
                    msg.prefix = null;
                else {
                    msg.prefix.forEach((p) => escapeRegex(p));
                    const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${msg.prefix.join('|')})\\s*`);
                    const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                    if (matchedPrefix)
                        msg.prefix = matchedPrefix;
                    else
                        msg.prefix = null;
                }
            }
            else if (msg === null || msg === void 0 ? void 0 : msg.prefix) {
                const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(msg.prefix.toLowerCase())})\\s*`);
                const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
                if (matchedPrefix)
                    msg.prefix = matchedPrefix;
                else
                    msg.prefix = null;
            }
            if (msg === null || msg === void 0 ? void 0 : msg.prefix) {
                const args = msg.content.substring(msg.prefix.length).split(' ');
                const label = args.shift().toLowerCase();
                const command = await this._client.commandHandler.getCommand(label);
                if (command) {
                    // @ts-ignore
                    msg.command = command;
                    await this._client.commandHandler.handleCommand(msg, msg.command, args);
                }
            }
            if ((this._client._options.eventHandler.commands && msg.command) || !msg.command) {
                const event = this.events.get('messageCreate');
                return event.run.call(this, msg);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = EventHandler;
//# sourceMappingURL=EventHandler.js.map