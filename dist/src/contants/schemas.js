"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSubSchema = exports.sendMessageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendMessageSchema = zod_1.default.object({
    roomId: zod_1.default.string(),
    message: zod_1.default.string(),
});
const messageSchema = zod_1.default.object({
    id: zod_1.default.string(),
    message: zod_1.default.string(),
    roomId: zod_1.default.string(),
    sendAt: zod_1.default.date(),
    sender: zod_1.default.object({
        name: zod_1.default.string(),
    }),
});
exports.messageSubSchema = zod_1.default.object({
    roomId: zod_1.default.string(),
});
