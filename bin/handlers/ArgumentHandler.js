"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/** ArgumentHandler Class */
class ArgumentHandler {
    /**
     * Create the argumentHandler
     * @param {object} client - Eris Client object
     * @param {object} command - Quartz Command object
     * @param {array} args - An array of strings as args
     */
    constructor(client, command, args) {
        this.client = client;
        this.command = command;
        this.args = args;
        this.string = args.join(' ');
        this.types = ['user', 'string', 'channel', 'role', 'message', 'integer', 'float', 'member'];
    }
    /**
     * Determine if the args is quoted
     * @return {array} Returns an array of strings with quotes removed
     */
    quoted() {
        let quoted = this.string.match(/“(?:\.|(\\“)|[^“”\n])*”|(?:[^\s"]+|"[^"]*")/g);
        if (quoted && quoted.length > 0) {
            quoted = quoted.map((q) => {
                if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith('“') && q.endsWith('”')))
                    return q.slice(1, -1);
                else
                    return q;
            });
        }
        return quoted || undefined;
    }
    /**
     * Determine if the args has prompts
     * @param {object} msg - The eris message object
     * @param {string} key - The key of the argument
     * @param {string|function} prompt - String or function of the prompt
     * @return {void} runs the prompt
     */
    async prompt(msg, key, prompt) {
        if (typeof prompt === 'string') {
            await msg.embed(prompt);
        }
        else if (typeof prompt === 'function') {
            await prompt(msg);
        }
        else {
            await msg.embed(`No result for ${key} found.`);
        }
    }
    /**
     * Determine if the arg has a default
     * @param {object} arg - The argument object
     * @param {object} msg - The key of the argument
     * @return {string|void} Returns text
     */
    default(arg, msg) {
        if (!arg.default)
            return undefined;
        if (typeof arg.default === 'string') {
            return arg.default;
        }
        else if (typeof arg.default === 'function') {
            return arg.default(msg);
        }
        else {
            return undefined;
        }
    }
    /**
     * Run the argument parser
     * @param {object} msg - The key of the argument
     * @return {any} Returns result
     */
    parse(msg) {
        if (this.command.args && this.command.args.length > 0) {
            const parsed = {};
            const args = this.quoted();
            let prompt = false;
            Promise.all(this.command.args.forEach(async (arg) => {
                if (arg.key && arg.type && this.types.includes(arg.type)) {
                    const CustomType = await Promise.resolve().then(() => __importStar(require(`../types/${arg.type}`)));
                    const type = new CustomType(this.client);
                    const defaultValue = this.default(arg, msg);
                    if (!defaultValue && (!args || args.length <= 0 || !args[this.command.args.indexOf(arg)] || this.command.args.indexOf(arg).length <= 0)) {
                        prompt = true;
                        await this.prompt(msg, arg.key, arg.prompt);
                        return;
                    }
                    if (!args || args.length <= 0) {
                        prompt = true;
                        await this.prompt(msg, arg.key, arg.prompt);
                        return;
                    }
                    if (this.command.args.slice(-1)[0].key === arg.key) {
                        args.splice(0, this.command.args.length - 1);
                        let result = type.parse(args.join(' ') || '' || defaultValue || '', msg);
                        if (!result) {
                            if (defaultValue)
                                result = defaultValue;
                            else {
                                prompt = true;
                                await this.prompt(msg, arg.key, arg.prompt);
                                return;
                            }
                        }
                        parsed[arg.key] = result;
                    }
                    else {
                        let result = type.parse(args[this.command.args.indexOf(arg)] || defaultValue || '', msg);
                        if (!result) {
                            if (defaultValue)
                                result = defaultValue;
                            else {
                                prompt = true;
                                await this.prompt(msg, arg.key, arg.prompt);
                                return;
                            }
                        }
                        parsed[arg.key] = result;
                    }
                }
            }));
            if (prompt)
                return undefined;
            return parsed || this.args;
        }
        else {
            return this.args;
        }
    }
}
exports.default = ArgumentHandler;
//# sourceMappingURL=ArgumentHandler.js.map