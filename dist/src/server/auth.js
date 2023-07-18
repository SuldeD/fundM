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
const crypto_1 = require("crypto");
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
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
exports.authOptions = {
    session: {
        strategy: "jwt",
    },
    events: {
        session: async (message) => {
            console.log("events this is message session", message);
        },
        linkAccount: async (message) => {
            console.log("events this is message linkAccount", message);
        },
    },
    callbacks: {
        signIn: ({ user, account, profile, email, credentials }) => {
            console.log("this is user", user, account, profile, email, credentials);
            return true;
        },
        session: async ({ session, token, user }) => {
            console.log("this is session", session, token, user);
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                },
            };
        },
        jwt: async ({ token, user, account }) => {
            var _a;
            console.log("this is token", token, user, account);
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = (_a = crypto_1.randomUUID === null || crypto_1.randomUUID === void 0 ? void 0 : (0, crypto_1.randomUUID)()) !== null && _a !== void 0 ? _a : (0, crypto_1.randomBytes)(32).toString("hex");
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
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Loan Service",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
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
                    // If no error and we have user data, return it
                    if (res.ok && account.success) {
                        console.log(account);
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
                        };
                    }
                }
                catch (e) {
                    console.log(e);
                }
                // Return null if user data could not be retrieved
                return null;
            },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    secret: process.env.NEXTAUTH_SECRET,
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
const getServerAuthSession = (ctx) => {
    return (0, next_auth_1.getServerSession)(ctx.req, ctx.res, exports.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
