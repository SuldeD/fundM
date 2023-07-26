"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const Loader_1 = require("app/components/Loader");
const auth_1 = require("app/utils/auth");
const react_1 = require("next-auth/react");
const Footer_1 = __importDefault(require("./Footer"));
const Header_1 = __importDefault(require("./Header"));
const { Content } = antd_1.Layout;
// @ts-ignore
const SimpleLayout = ({ children }) => {
    const { status } = (0, react_1.useSession)();
    (0, auth_1.useRequireAuth)();
    if (status == "loading") {
        return <Loader_1.Loaderr />;
    }
    return (<antd_1.Layout>
      <Header_1.default />
      <Content>{children}</Content>
      <Footer_1.default />
    </antd_1.Layout>);
};
exports.default = SimpleLayout;
