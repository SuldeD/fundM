"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppContext = exports.AppWrapper = void 0;
const react_1 = require("react");
const AppContext = (0, react_1.createContext)({});
const AppWrapper = ({ children }) => {
    const [myFundTabKey, setMyFundTabKey] = (0, react_1.useState)("1");
    const value = {
        myFundTabKey,
        setMyFundTabKey,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
exports.AppWrapper = AppWrapper;
const useAppContext = () => (0, react_1.useContext)(AppContext);
exports.useAppContext = useAppContext;
