"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogHandler_1 = __importDefault(require("./handlers/LogHandler"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const EventHandler_1 = __importDefault(require("./handlers/EventHandler"));
const CommandHandler_1 = __importDefault(require("./handlers/CommandHandler"));
const Embed_1 = __importDefault(require("./structures/Embed"));
/** QuartzClient Class */
class QuartzClient extends eventemitter3_1.default {
    constructor(options, eris) {
        super();
        if (!options)
            options = { owner: null, eventHandler: null, commandHandler: null };
        this._client = eris;
        this.owner = options.owner;
        this.logger = new LogHandler_1.default();
        this.eventHandler = new EventHandler_1.default(this, options.eventHandler);
        this.commandHandler = new CommandHandler_1.default(this, options.commandHandler);
        this._client.embed = () => new Embed_1.default();
        this._client.commandHandler = this.commandHandler;
        this._client.eventHandler = this.eventHandler;
        this._client.logger = this.logger;
    }
    /**
     * Get the eris client object
     * @return {object} The eris client object.
     */
    get client() {
        return this._client;
    }
    /**
     * Start the bot
     */
    async start() {
        // Load events using eventHandler
        await this.eventHandler.loadEvents();
        // Load commands using commandHandler
        await this.commandHandler.loadCommands();
        // Bind messageCreate to commandHandler
        this._client.on('messageCreate', this.commandHandler._onMessageCreate.bind(this.commandHandler));
        // Connect to discord using eris client
        return this._client.connect().catch((error) => {
            throw new Error(`Unable to start: ${error}`);
        });
    }
}
exports.default = QuartzClient;
//# sourceMappingURL=QuartzClient.js.map