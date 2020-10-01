"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Event Class */
class Event extends Base_1.default {
    constructor(client, options = {}) {
        super(client);
        const { name = '' } = options;
        this.name = name;
    }
    /**
     * Run when command called
     */
    run() {
        throw new Error(`${this.constructor.name}#run has not been implemented`);
    }
}
exports.default = Event;
//# sourceMappingURL=Event.js.map