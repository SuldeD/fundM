"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const key1_ = "c8CfdYcxdJLcJhW6XpKu";
const key2_ = "hJNdk55TRruTqR5YxzwB";
const key3_ = "uFusGUGbQmxeT8nqbSRs";
const bytes = crypto_js_1.default.SHA1(key1_).toString();
const key = crypto_js_1.default.SHA1(key2_ + bytes).toString();
const stringify = (cipherParams) => {
    const data = {
        ct: cipherParams.ciphertext.toString(crypto_js_1.default.enc.Base64),
    };
    if (cipherParams.iv)
        data.iv = cipherParams.iv.toString();
    if (cipherParams.salt)
        data.s = cipherParams.salt.toString();
    return JSON.stringify(data);
};
const parse = (jsonStr) => {
    const data = JSON.parse(jsonStr);
    const cipherParams = crypto_js_1.default.lib.CipherParams.create({
        ciphertext: crypto_js_1.default.enc.Base64.parse(data.ct),
    });
    if (data.iv)
        cipherParams.iv = crypto_js_1.default.enc.Hex.parse(data.iv);
    if (data.s)
        cipherParams.salt = crypto_js_1.default.enc.Hex.parse(data.s);
    return cipherParams;
};
const encrypt = (request) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(request), key, {
        format: { stringify, parse },
    }).toString();
};
exports.encrypt = encrypt;
const decrypt = (response) => {
    try {
        return JSON.parse(crypto_js_1.default.AES.decrypt(typeof response === "object" ? JSON.stringify(response) : response, key, {
            format: { stringify, parse },
        }).toString(crypto_js_1.default.enc.Utf8));
    }
    catch (e) {
        console.log("decrypt error: ", e);
        return null;
    }
};
exports.decrypt = decrypt;
