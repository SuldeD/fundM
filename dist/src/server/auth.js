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
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
exports.authOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: (0, prisma_adapter_1.PrismaAdapter)(db_1.prisma),
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        (0, credentials_1.default)({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
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
                console.log(JSON.stringify(credentials));
                const res = await fetch("http://192.168.1.2/account/login", {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json",
                        "Profile-Timezone": "1",
                        "Client-Timezone": "1",
                        "App-Version": "1",
                        "OS-Version": "1",
                        "Device-Id": "1",
                        "Device-Name": "",
                        "Device-Type": "1",
                        "App-Id": "fundme",
                        Language: "mn",
                    },
                });
                const user = await res.json();
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
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
