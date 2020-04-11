"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const client_1 = __importDefault(require("./client"));
exports.Client = client_1.default;
const types_1 = require("./types");
exports.Events = types_1.Events;
const Base_1 = __importDefault(require("./structures/Base"));
exports.Base = Base_1.default;
const Command_1 = __importDefault(require("./structures/Command"));
exports.Command = Command_1.default;
const Event_1 = __importDefault(require("./structures/Event"));
exports.Event = Event_1.default;
const Embed_1 = __importDefault(require("./structures/Embed"));
exports.Embed = Embed_1.default;
if (Number(process.version.slice(1).split('.')[0]) < 10)
    throw new Error('Node 10 or higher is required.');
//# sourceMappingURL=index.js.map