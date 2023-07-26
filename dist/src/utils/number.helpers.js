"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToCurrency = void 0;
const numberToCurrency = (value) => `${value !== null && value !== void 0 ? value : ""} ₮`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
exports.numberToCurrency = numberToCurrency;
