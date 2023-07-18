"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanRouter = void 0;
const contants_1 = require("app/contants");
const trpc_1 = require("app/server/api/trpc");
const aes_helper_1 = require("app/utils/aes.helper");
exports.loanRouter = (0, trpc_1.createTRPCRouter)({
    accountStatus: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/account/get/status", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                ...contants_1.loanServiceHeaders,
                Cookie: token.id_token,
                "Session-Token": token.access_token,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        console.log(accountStatus);
        return accountStatus;
    }),
    accountInfo: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/account/get/info", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                ...contants_1.loanServiceHeaders,
                Cookie: token.id_token,
                "Session-Token": token.access_token,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        console.log(accountStatus);
        return accountStatus;
    }),
});
const getAccountToken = async (ctx) => {
    var _a;
    const token = await ctx.prisma.account.findFirst({
        where: {
            userId: (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user.id,
        },
    });
    return token;
};
