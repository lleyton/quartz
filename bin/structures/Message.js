"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = __importDefault(require("eris"));
const __1 = require("..");
const util_1 = __importDefault(require("util"));
const prefix = (msg, _prefix) => {
    if (typeof _prefix !== 'function')
        return _prefix;
    else
        return _prefix(msg);
};
const color = (msg, _color) => {
    if (typeof _color !== 'function')
        return _color;
    else
        return _color(msg);
};
const text = (msg, _text) => {
    if (typeof _text !== 'function')
        return _text;
    else
        return _text(msg);
};
const logo = (msg, _logo) => {
    if (typeof _logo !== 'function')
        return _logo;
    else
        return _logo(msg);
};
class Message extends eris_1.default.Message {
    constructor(msg, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super({
            id: msg.id,
            channel_id: msg.channel.id,
            author: msg.author
        }, client);
        this.client = client;
        const _prefix = prefix(msg, (_b = (_a = this.client._options) === null || _a === void 0 ? void 0 : _a.commandHandler) === null || _b === void 0 ? void 0 : _b.prefix);
        this.guild = ((_c = msg.member) === null || _c === void 0 ? void 0 : _c.guild) || null;
        this.prefix = _prefix;
        this.color = color(msg, (_e = (_d = this.client._options) === null || _d === void 0 ? void 0 : _d.commandHandler) === null || _e === void 0 ? void 0 : _e.color);
        this.text = text(msg, (_g = (_f = this.client._options) === null || _f === void 0 ? void 0 : _f.commandHandler) === null || _g === void 0 ? void 0 : _g.text);
        this.logo = logo(msg, (_j = (_h = this.client._options) === null || _h === void 0 ? void 0 : _h.commandHandler) === null || _j === void 0 ? void 0 : _j.logo);
        this.content = msg.content.replace(/<@!/g, '<@');
    }
    /**
     * Return a embed
     * @param {string} message - The embed content
     * @param {object} options - The embed options
     * @return {object} The embed
     */
    async embed(message, options) {
        return await new Promise((resolve, reject) => {
            const generateEmbed = new __1.Embed();
            if (!options)
                options = { reply: false, bold: false, color: null, footer: false, text: false };
            if (options.reply && !options.bold)
                message = `<@${this.author.id}>, ${message}`;
            else if (options.bold && !options.reply)
                message = `**${message}**`;
            else if (options.bold && options.reply)
                message = `**<@${this.author.id}>, ${message}**`;
            if (options.text) {
                this.channel.createMessage(message)
                    .then((erisMsg) => resolve(new Message(erisMsg, this.client)))
                    .catch((error) => reject(error));
                return;
            }
            generateEmbed.setDescription(message);
            if (options.color)
                generateEmbed.setColor(options.color);
            else
                generateEmbed.setColor(this.color);
            if (options.footer)
                generateEmbed.setFooter(this.text, this.logo);
            this.channel.createMessage({ embed: generateEmbed })
                .then((erisMsg) => resolve((new Message(erisMsg, this.client))))
                .catch((error) => reject(error));
        });
    }
    /**
     * Get server settings
     * @param {object} msg - The message object
     * @return {object} The settings object
     */
    settings() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof ((_b = (_a = this.client._options) === null || _a === void 0 ? void 0 : _a.commandHandler) === null || _b === void 0 ? void 0 : _b.settings) !== 'function') {
            if (util_1.default.types.isAsyncFunction(this._settings)) {
                return (_d = (_c = this.client._options) === null || _c === void 0 ? void 0 : _c.commandHandler) === null || _d === void 0 ? void 0 : _d.settings(this).then((settings) => settings).catch((error) => {
                    throw new Error(error.message);
                });
            }
            return (_f = (_e = this.client._options) === null || _e === void 0 ? void 0 : _e.commandHandler) === null || _f === void 0 ? void 0 : _f.settings;
        }
        else
            return (_h = (_g = this.client._options) === null || _g === void 0 ? void 0 : _g.commandHandler) === null || _h === void 0 ? void 0 : _h.settings(this);
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map