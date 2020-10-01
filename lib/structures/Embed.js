"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Embed Class */
class Embed {
    constructor(data = {}) {
        this.fields = [];
        Object.assign(this, data);
        return this;
    }
    /**
     * Author for the embed
     * @param {string} name - The username displayed in the embed header
     * @param {string} icon - The icon displayed in the embed header
     * @param {string} url - The url displayed in the embed header
     */
    setAuthor(name, icon, url) {
        this.author = { name, icon_url: icon, url };
        return this;
    }
    /**
     * Color for the embed
     * @param {string} color - A color hex that is a string or a number
     */
    setColor(color) {
        if (typeof color === 'string')
            color = parseInt(color.replace('#', ''), 16);
        if (color < 0 || color > 0xFFFFFF)
            throw new RangeError('Color range is invaild.');
        else if (isNaN(color))
            throw new TypeError('Unable to convert color.');
        this.color = color;
        return this;
    }
    /**
     * Description for the embed
     * @param {string} desc - Set the description field of the embed
     */
    setDescription(desc) {
        this.description = desc.toString().substring(0, 2048);
        return this;
    }
    /**
     * Field for the embed
     * @param {string} name - A name
     * @param {string} value - A value
     * @param {boolean} inline - A inline
     */
    addField(name, value, inline = false) {
        if (this.fields.length >= 25)
            return this;
        else if (name === '')
            throw new TypeError('Missing name field.');
        else if (value === '')
            throw new TypeError('Missing value field.');
        this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline });
        return this;
    }
    /**
     * File for the embed
     * @param {string} file - A file
     */
    setFile(file) {
        this.file = file;
        return this;
    }
    /**
     * Footer for the embed
     * @param {string} text - A text
     * @param {string} icon - A icon
     */
    setFooter(text, icon) {
        this.footer = { text: text.toString().substring(0, 2048), icon_url: icon };
        return this;
    }
    /**
     * Image for the embed
     * @param {string} url - A url
     */
    setImage(url) {
        this.image = { url };
        return this;
    }
    /**
     * Timestamp for the embed
     * @param {date} time - A date
     */
    setTimestamp(time = new Date()) {
        this.date = time;
        return this;
    }
    /**
     * Title for the embed
     * @param {string} title - A title
     */
    setTitle(title) {
        this.title = title.toString().substring(0, 256);
        return this;
    }
    /**
     * Thumbnail for the embed
     * @param {string} url - A url
     */
    setThumbnail(url) {
        this.thumbnail = { url };
        return this;
    }
    /**
     * URL for the embed
     * @param {string} url - A url
     */
    setURL(url) {
        this.url = url;
        return this;
    }
}
exports.default = Embed;
//# sourceMappingURL=Embed.js.map