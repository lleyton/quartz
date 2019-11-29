"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const eris_1 = require("eris");
const quartzEvents = ['missingPermission', 'commandRun', 'ratelimited'];
/** EventHandler Class */
class EventHandler {
    constructor(quartz, options) {
        if (!options)
            options = { directory: './commands', debug: false };
        this._quartz = quartz;
        this.directory = options.directory;
        this.debug = options.debug;
        this.events = new eris_1.Collection(null);
    }
    /**
     * Get the quartz client object
     * @return {object} The quartz client object.
     */
    get quartz() {
        return this._quartz;
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._quartz.client;
    }
    /**
     * Load the events from the folder
     */
    async loadEvents() {
        const files = await fs_1.readdirSync(this.directory).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
        if (files.length <= 0)
            throw new Error(`No files found in events folder '${this.directory}'`);
        await files.forEach((file) => {
            const Event = require(path_1.resolve(`${this.directory}${path_1.sep}${file}`));
            const evt = new Event(this.client);
            if (!evt)
                throw new Error(`Event ${this.directory}${path_1.sep}${file} file is empty`);
            if (!evt.name)
                throw new Error(`Event ${this.directory}${path_1.sep}${file} is missing a name`);
            if (this.events.get(evt.name))
                throw new Error(`Event ${this.directory}${path_1.sep}${file} already exists`);
            this.events.set(evt.name, evt);
            if (this.debug)
                this.quartz.logger.info(`Loading event ${evt.name}`);
            if (quartzEvents.includes(evt.name))
                this.quartz.on(evt.name, evt.run.bind(this));
            else if (evt.name === 'messageCreate')
                this.client.on(evt.name, this._onMessageCreate.bind(this));
            else
                this.client.on(evt.name, evt.run.bind(this));
        });
    }
    /**
     * Runs event
     * @param {object} msg - The message object
     */
    async _onMessageCreate(msg) {
        if (!msg.author || msg.author.bot)
            return;
        msg.command = false;
        const prefix = await this.client.commandHandler.prefix(msg);
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const content = msg.content.toLowerCase();
        if (Array.isArray(prefix)) {
            prefix.forEach(p => escapeRegex(p));
            const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`);
            const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
            if (matchedPrefix)
                msg.prefix = matchedPrefix;
        }
        else {
            const content = msg.content.toLowerCase();
            const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`);
            const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined;
            if (matchedPrefix)
                msg.prefix = matchedPrefix;
        }
        msg.content = msg.content.replace(/<@!/g, '<@');
        if (msg.prefix) {
            const args = msg.content.substring(msg.prefix.length).split(' ');
            const label = args.shift().toLowerCase();
            const command = await this.client.commandHandler.getCommand(label);
            if (command)
                msg.command = command;
        }
        const event = this.events.get('messageCreate');
        return event.run.call(this, msg);
    }
}
exports.default = EventHandler;
//# sourceMappingURL=EventHandler.js.map