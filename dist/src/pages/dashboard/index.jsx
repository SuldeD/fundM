"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("app/utils/api");
const react_1 = __importDefault(require("react"));
function index() {
    const { data } = api_1.api.loan.accountInfo.useQuery();
    return (<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div>{JSON.stringify(data)}</div>
    </main>);
}
exports.default = index;
