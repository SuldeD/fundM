"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanRouter = void 0;
const contants_1 = require("app/contants");
const trpc_1 = require("app/server/api/trpc");
const aes_helper_1 = require("app/utils/aes.helper");
const zod_1 = __importDefault(require("zod"));
exports.loanRouter = (0, trpc_1.createTRPCRouter)({
    accountStatus: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/account/status", {
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
        return accountStatus;
    }),
    accountStatusDan: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/sso/request/user", {
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
        return accountStatus;
    }),
    accountInfo: trpc_1.publicProcedure.query(async ({ ctx }) => {
        console.log("accountInfo");
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
        return accountStatus;
    }),
    phoneSignUp: trpc_1.publicProcedure
        .input(zod_1.default.object({ phone: zod_1.default.string() }))
        .mutation(async ({ input }) => {
        const { phone } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            phone,
        }));
        const res2 = await fetch("http://is.fundme.com/account/signup", {
            method: "POST",
            credentials: "same-origin",
            body: body,
            headers: {
                ...contants_1.loanServiceHeaders,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        return accountStatus;
    }),
    phoneSignUpVerify: trpc_1.publicProcedure
        .input(zod_1.default.object({
        phone: zod_1.default.string(),
        tmp_user_id: zod_1.default.string(),
        pin_code: zod_1.default.string(),
    }))
        .mutation(async ({ input }) => {
        const { phone, pin_code, tmp_user_id } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            phone,
            pin_code,
            tmp_user_id,
        }));
        const res2 = await fetch("http://is.fundme.com/account/verify/phone", {
            method: "POST",
            credentials: "same-origin",
            body: body,
            headers: {
                ...contants_1.loanServiceHeaders,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        return accountStatus;
    }),
    SignUp: trpc_1.publicProcedure
        .input(zod_1.default.object({
        phone: zod_1.default.string(),
        username: zod_1.default.string(),
        tmp_user_id: zod_1.default.string(),
        password: zod_1.default.string(),
        pin_code: zod_1.default.string(),
        security_question_id: zod_1.default.string(),
        question: zod_1.default.string(),
        answer: zod_1.default.string(),
        transaction_password: zod_1.default.string(),
    }))
        .mutation(async ({ input }) => {
        const { phone, username, tmp_user_id, password, pin_code, security_question_id, question, answer, transaction_password, } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            phone,
            username,
            tmp_user_id,
            password,
            pin_code,
            security_question_id,
            question,
            answer,
            transaction_password,
        }));
        const res2 = await fetch("http://is.fundme.com/account/new/user", {
            method: "POST",
            credentials: "same-origin",
            body: body,
            headers: {
                ...contants_1.loanServiceHeaders,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        return accountStatus;
    }),
    helpQuestion: trpc_1.publicProcedure.query(async ({}) => {
        const res2 = await fetch("http://is.fundme.com/help/security/question/list", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                ...contants_1.loanServiceHeaders,
            },
        });
        const raw2 = await res2.json();
        const accountStatus = (0, aes_helper_1.decrypt)(raw2);
        return accountStatus;
    }),
    helpBankList: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/help/bank/list", {
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
        return accountStatus;
    }),
    reguestSearch: trpc_1.publicProcedure
        .input(zod_1.default.object({
        order: zod_1.default.string(),
        order_up: zod_1.default.string(),
        page: zod_1.default.string(),
        page_size: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { order, order_up, page, page_size } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            order,
            order_up,
            page,
            page_size,
        }));
        const res2 = await fetch("http://is.fundme.com/request/search", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    loanSearch: trpc_1.publicProcedure
        .input(zod_1.default.object({
        order: zod_1.default.string(),
        order_up: zod_1.default.string(),
        page: zod_1.default.string(),
        page_size: zod_1.default.string(),
        filter_type: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { order, order_up, page, page_size, filter_type } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            order,
            order_up,
            page,
            page_size,
            filter_type,
        }));
        const res2 = await fetch("http://is.fundme.com/loan/search", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    loanRequest: trpc_1.publicProcedure
        .input(zod_1.default.object({
        loan_amount: zod_1.default.string(),
        repayment_amount: zod_1.default.string(),
        loan_month: zod_1.default.string(),
        product_id: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { product_id, loan_amount, repayment_amount, loan_month } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            product_id,
            loan_amount,
            repayment_amount,
            loan_month,
        }));
        const res2 = await fetch("http://is.fundme.com/loan/request", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    loanRequestConfirm: trpc_1.publicProcedure
        .input(zod_1.default.object({
        request_id: zod_1.default.string(),
        password: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { request_id, password } = input;
        const form_data = [];
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            request_id,
            form_data,
            password,
        }));
        const res2 = await fetch("http://is.fundme.com/loan/request/confirm", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    addBank: trpc_1.publicProcedure
        .input(zod_1.default.object({
        account_num: zod_1.default.string(),
        bank_id: zod_1.default.string(),
        password: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { bank_id, password, account_num } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            bank_id,
            account_num,
            password,
        }));
        const res2 = await fetch("http://is.fundme.com/account/add/bank/account", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    addBankVerify: trpc_1.publicProcedure
        .input(zod_1.default.object({
        photo: zod_1.default.string(),
        confirm_code: zod_1.default.string(),
        password: zod_1.default.string(),
        request_id: zod_1.default.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const token = await getAccountToken(ctx);
        const { photo, password, confirm_code, request_id } = input;
        const body = (0, aes_helper_1.encrypt)(JSON.stringify({
            photo,
            confirm_code,
            request_id,
            password,
        }));
        const res2 = await fetch("http://is.fundme.com/loan/bank/account/verify", {
            method: "POST",
            credentials: "same-origin",
            body: body,
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
    loanList: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const token = await getAccountToken(ctx);
        const res2 = await fetch("http://is.fundme.com/product/list", {
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
    // console.log("getAccountToken", ctx?.session);
    return (ctx === null || ctx === void 0 ? void 0 : ctx.session).token;
};
