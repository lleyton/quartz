"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
/** LogHandler Class */
class LogHandler {
    /**
     * Send warning to console
     * @param {string} message - The warning message
     */
    warn(...message) {
        console.log(chalk_1.default.yellow('[WARNING]'));
        console.warn(...message);
    }
    /**
     * Send error to console
     * @param {string} message - The error message
     */
    error(...message) {
        console.log(chalk_1.default.red('[ERROR]'));
        console.log(...message);
        console.trace();
    }
    /**
     * Send info to console
     * @param {string} message - The info message
     */
    info(...message) {
        console.log(chalk_1.default.hex('#7289DA')('[Points]: ') + chalk_1.default.yellow(...message));
    }
    /**
     * Send console to console
     * @param {string} message - The console message
     */
    console(...message) {
        console.log(...message);
    }
}
exports.default = LogHandler;
//# sourceMappingURL=LogHandler.js.map