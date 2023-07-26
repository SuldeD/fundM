"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerAuthSession = exports.authOptions = void 0;
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const next_auth_1 = require("next-auth");
const google_1 = __importDefault(require("next-auth/providers/google"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const db_1 = require("app/server/db");
const aes_helper_1 = require("app/utils/aes.helper");
const contants_1 = require("app/contants");
const prismaAdapter = (0, prisma_adapter_1.PrismaAdapter)(db_1.prisma);
// @ts-ignore
prismaAdapter.createUser = (data) => {
    console.log("this create account Data: ", data);
    return db_1.prisma.user.create({ data });
};
prismaAdapter.createSession = (data) => {
    console.log(" createSession Data: ", data);
    return db_1.prisma.session.create({
        data: {
            ...data,
        },
    });
};
prismaAdapter.linkAccount = async (data) => {
    console.log("linkAccount Data: ", data);
    db_1.prisma.account.create({
        data: {
            ...data,
        },
    });
};
exports.authOptions = {
    session: {
        strategy: "jwt",
    },
    events: {
        session: async (message) => {
            console.log("events this is message session");
        },
        linkAccount: async (message) => {
            console.log("events this is message linkAccount");
        },
    },
    callbacks: {
        signIn: ({ user, account, profile, email, credentials }) => {
            // console.log("this is user", user, account, profile, email, credentials);
            return true;
        },
        session: async ({ session, token, user }) => {
            console.log("this is session");
            // const { data } = api.loan.accountInfo.useQuery();
            // console.log(data);
            // let info = (session as any).info;
            // if (!info) {
            //   console.log("account info fetch");
            //   const res2 = await fetch("http://is.fundme.com/account/get/info", {
            //     method: "GET",
            //     credentials: "same-origin",
            //     headers: {
            //       ...loanServiceHeaders,
            //       Cookie: token.picture!,
            //       "Session-Token": token.token as string,
            //     },
            //   });
            //   const raw2 = await res2.json();
            //   info = decrypt(raw2);
            // }
            return {
                ...session,
                user: {
                    ...session.user,
                    // ...data,
                    id: token.id,
                },
                // info: { ...info },
                token: {
                    access_token: token.token,
                    id_token: token.picture,
                },
            };
        },
        jwt: async ({ token, user, account }) => {
            console.log("this is token");
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.access_token;
                token.picture = user.id_token;
            }
            return token;
        },
    },
    adapter: prismaAdapter,
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        (0, credentials_1.default)({
            id: "credentials",
            name: "Loan Service",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const body = (0, aes_helper_1.encrypt)(JSON.stringify({
                    phone: credentials.username,
                    pin_code: credentials.password,
                    latitude: "",
                    longitude: "",
                }));
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/account/login`, {
                        method: "POST",
                        body: body,
                        credentials: "same-origin",
                        headers: contants_1.loanServiceHeaders,
                    });
                    const cookie = res.headers.get("Set-Cookie");
                    const token = res.headers.get("Session-Token");
                    const raw = await res.json();
                    const user = (0, aes_helper_1.decrypt)(raw);
                    const res2 = await fetch("http://is.fundme.com/account/get/info", {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            ...contants_1.loanServiceHeaders,
                            Cookie: cookie,
                            "Session-Token": token,
                        },
                    });
                    const raw2 = await res2.json();
                    const account = (0, aes_helper_1.decrypt)(raw2);
                    if (res.ok && account.success) {
                        const pacc = await db_1.prisma.account.findFirst({
                            where: {
                                userId: account.account.user_id,
                            },
                        });
                        if (!pacc) {
                            await db_1.prisma.user.create({
                                data: {
                                    id: account.account.user_id,
                                    name: account.account.first_name,
                                    email: account.account.email,
                                    phone: account.account.phone,
                                },
                            });
                            await db_1.prisma.account.create({
                                data: {
                                    provider: "loan_service",
                                    userId: account.account.user_id,
                                    type: "loan_service",
                                    providerAccountId: account.account.user_id,
                                    id_token: cookie,
                                    access_token: token,
                                },
                            });
                        }
                        else {
                            await db_1.prisma.account.update({
                                where: {
                                    id: pacc.id,
                                },
                                data: {
                                    ...pacc,
                                    id_token: cookie,
                                    access_token: token,
                                },
                            });
                        }
                        return {
                            id: account.account.user_id,
                            name: account.account.first_name,
                            email: account.account.phone,
                            id_token: cookie,
                            access_token: token,
                        };
                    }
                }
                catch (e) {
                    console.log(e);
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
const getServerAuthSession = (ctx) => {
    return (0, next_auth_1.getServerSession)(ctx.req, ctx.res, exports.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
