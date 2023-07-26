"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("next-auth/react");
const api_1 = require("app/utils/api");
require("app/styles/globals.css");
const head_1 = __importDefault(require("next/head"));
const mn_MN_1 = __importDefault(require("antd/locale/mn_MN"));
const antd_1 = require("antd");
const mainLayout_1 = __importDefault(require("./mainLayout"));
const appContext_1 = require("app/context/appContext");
const MyApp = ({ Component, pageProps: { session, ...pageProps }, }) => {
    return (<>
      <head_1.default>
        <title>FundMe</title>
        <meta name="description" content="FundMe"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/favicon.svg"/>
      </head_1.default>
      <react_1.SessionProvider session={session}>
        <antd_1.App>
          <antd_1.ConfigProvider theme={{
            token: {
                colorPrimary: "#0300B4",
            },
        }} locale={mn_MN_1.default}>
            <appContext_1.AppWrapper>
              {/* <ApiWrapper> */}
              <mainLayout_1.default>
                <Component {...pageProps}/>
              </mainLayout_1.default>
              {/* </ApiWrapper> */}
            </appContext_1.AppWrapper>
          </antd_1.ConfigProvider>
        </antd_1.App>
      </react_1.SessionProvider>
    </>);
};
exports.default = api_1.api.withTRPC(MyApp);
