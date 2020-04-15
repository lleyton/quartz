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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _client;
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const util_1 = __importDefault(require("util"));
const prefix = (msg, _prefix) => {
    if (typeof _prefix === 'function') {
        if (util_1.default.types.isAsyncFunction(_prefix)) {
            return _prefix(msg)
                .then((prefix) => prefix)
                .catch((error) => {
                throw new Error(error.message);
            });
        }
        return _prefix(msg);
    }
    else
        return _prefix;
};
const color = (msg, _color) => {
    if (typeof _color === 'function') {
        if (util_1.default.types.isAsyncFunction(_color)) {
            return _color(msg)
                .then((color) => color)
                .catch((error) => {
                throw new Error(error.message);
            });
        }
        return _color(msg);
    }
    else
        return _color;
};
const text = (msg, _text) => {
    if (typeof _text === 'function') {
        if (util_1.default.types.isAsyncFunction(_text)) {
            return _text(msg)
                .then((text) => text)
                .catch((error) => {
                throw new Error(error.message);
            });
        }
        return _text(msg);
    }
    else
        return _text;
};
const logo = (msg, _logo) => {
    if (typeof _logo === 'function') {
        if (util_1.default.types.isAsyncFunction(_logo)) {
            return _logo(msg)
                .then((logo) => logo)
                .catch((error) => {
                throw new Error(error.message);
            });
        }
        return _logo(msg);
    }
    else
        return _logo;
};
class Message {
    constructor(msg, client) {
        _client.set(this, void 0);
        Object.assign(this, msg);
        __classPrivateFieldSet(this, _client, client);
    }
    async _configure() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.prefix = await prefix(this, (_b = (_a = __classPrivateFieldGet(this, _client)._options) === null || _a === void 0 ? void 0 : _a.commandHandler) === null || _b === void 0 ? void 0 : _b.prefix);
        this.color = await color(this, (_d = (_c = __classPrivateFieldGet(this, _client)._options) === null || _c === void 0 ? void 0 : _c.commandHandler) === null || _d === void 0 ? void 0 : _d.color);
        this.text = await text(this, (_f = (_e = __classPrivateFieldGet(this, _client)._options) === null || _e === void 0 ? void 0 : _e.commandHandler) === null || _f === void 0 ? void 0 : _f.text);
        this.logo = await logo(this, (_h = (_g = __classPrivateFieldGet(this, _client)._options) === null || _g === void 0 ? void 0 : _g.commandHandler) === null || _h === void 0 ? void 0 : _h.logo);
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
                    .then((erisMsg) => resolve(new Message(erisMsg, __classPrivateFieldGet(this, _client))))
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
                .then((erisMsg) => resolve((new Message(erisMsg, __classPrivateFieldGet(this, _client)))))
                .catch((error) => reject(error));
        });
    }
    /**
     * Get server settings
     * @param {object} msg - The message object
     * @return {object} The settings object
     */
    settings() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (typeof ((_b = (_a = __classPrivateFieldGet(this, _client)._options) === null || _a === void 0 ? void 0 : _a.commandHandler) === null || _b === void 0 ? void 0 : _b.settings) === 'function') {
            if (util_1.default.types.isAsyncFunction((_d = (_c = __classPrivateFieldGet(this, _client)._options) === null || _c === void 0 ? void 0 : _c.commandHandler) === null || _d === void 0 ? void 0 : _d.settings)) {
                return (_f = (_e = __classPrivateFieldGet(this, _client)._options) === null || _e === void 0 ? void 0 : _e.commandHandler) === null || _f === void 0 ? void 0 : _f.settings(this).then((settings) => settings).catch((error) => {
                    throw new Error(error.message);
                });
            }
            return (_h = (_g = __classPrivateFieldGet(this, _client)._options) === null || _g === void 0 ? void 0 : _g.commandHandler) === null || _h === void 0 ? void 0 : _h.settings(this);
        }
        else
            return (_k = (_j = __classPrivateFieldGet(this, _client)._options) === null || _j === void 0 ? void 0 : _j.commandHandler) === null || _k === void 0 ? void 0 : _k.settings;
    }
}
_client = new WeakMap();
exports.default = Message;
//# sourceMappingURL=Message.js.map