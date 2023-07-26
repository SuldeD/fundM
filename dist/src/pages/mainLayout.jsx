"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("app/utils/auth");
const react_1 = require("next-auth/react");
const cmsLayout_1 = require("../cmsLayout");
const layout_1 = __importDefault(require("../layout"));
// @ts-ignore
const MainLayout = ({ children }) => {
    const { data } = (0, react_1.useSession)();
    (0, auth_1.useRequireAuth)();
    const Layout = (data === null || data === void 0 ? void 0 : data.user) ? cmsLayout_1.ProtectedLayout : layout_1.default;
    return <Layout>{children}</Layout>;
};
exports.default = MainLayout;
