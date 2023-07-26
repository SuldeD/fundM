"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequireAuth = void 0;
const react_1 = require("next-auth/react");
const router_1 = require("next/router");
const react_2 = require("react");
function useRequireAuth() {
    const router = (0, router_1.useRouter)();
    const { data, status } = (0, react_1.useSession)();
    const privatePaths = [
        "/dashboard",
        "/dashboard/fund",
        "/dashboard/myfund",
        "/dashboard/myfund/list",
        "/dashboard/history",
        "/dashboard/loan",
        "/dashboard/foundation",
        "/dashboard/profile",
        "/dashboard/profile/bank",
    ];
    const publicPaths = [
        "/login",
        "/signup",
        "/signup/verify-phone",
        "/signup/password",
        "/signup/question",
        "/signup/transaction-password",
        "/",
        "/about-us",
        "/finance",
        "/loan",
        "/#app",
        "/#contact",
    ];
    const path = router.asPath.split("?")[0];
    (0, react_2.useEffect)(() => {
        if (status == "loading") {
        }
        else if ((data === null || data === void 0 ? void 0 : data.user) && !(privatePaths === null || privatePaths === void 0 ? void 0 : privatePaths.includes(path))) {
            router.replace("/dashboard");
        }
        else if (!data && !(publicPaths === null || publicPaths === void 0 ? void 0 : publicPaths.includes(path))) {
            router.replace("/");
        }
    }, []);
}
exports.useRequireAuth = useRequireAuth;
