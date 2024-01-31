import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "app/server/db";
import { decrypt, encrypt } from "app/utils/aes.helper";
import { loanServiceHeaders } from "app/contants";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      bank_account: any;
    } & DefaultSession["user"];
  }
}
const prismaAdapter = PrismaAdapter(prisma);

// @ts-ignore
prismaAdapter.createUser = (data) => {
  console.log("this create account Data: ", data);
  return prisma.user.create({ data });
};
prismaAdapter.createSession = (data) => {
  console.log(" createSession Data: ", data);
  return prisma.session.create({
    data: {
      ...data,
    },
  });
};
prismaAdapter.linkAccount = async (data) => {
  console.log("linkAccount Data: ", data);
  prisma.account.create({
    data: {
      ...data,
    },
  });
};

export const authOptions: NextAuthOptions = {
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
      console.log(session, "this is session");

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
        token.token = (user as any).access_token;
        token.picture = (user as any).id_token;
      }
      return token;
    },
  },
  adapter: prismaAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Loan Service",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        deviceId: { label: "DeviceId", type: "text" },
      },
      async authorize(credentials, req) {
        const cookieValues = req.headers?.cookie.split(";");
        const csrftoken = cookieValues.find(
          (val: string) => val.indexOf("next-auth.csrf-token") > -1
        );
        const [key, devId] = csrftoken.split("=");

        // const devId = req.headers?.cookie?.match(
        //   /next-auth\.csrf-token=([^;]*)/
        // );
        const body = encrypt(
          JSON.stringify({
            phone: credentials!.username,
            pin_code: credentials!.password,
            latitude: "",
            longitude: "",
          })
        );
        const res = await fetch(`${process.env.BACKEND_URL}/account/login`, {
          method: "POST",
          body: body,
          credentials: "same-origin",
          headers: {
            ...loanServiceHeaders,
            "Device-Id": devId,
          },
        });
        const cookie = res.headers.get("Set-Cookie");
        const token = res.headers.get("Session-Token");

        const raw = await res.json();
        const user = decrypt(raw);
        if (user.success) {
          const res2 = await fetch(
            `${process.env.BACKEND_URL}/account/get/info`,
            {
              method: "GET",
              credentials: "same-origin",
              headers: {
                ...loanServiceHeaders,
                Cookie: cookie!,
                "Session-Token": token!,
                "Device-Id": devId,
              },
            }
          );

          const raw2 = await res2.json();
          console.log("raw2: ", raw2);
          const account = decrypt(raw2);

          if (res.ok && account.success) {
            const pacc = await prisma.account.findFirst({
              where: {
                userId: account.account.user_id,
              },
            });
            if (!pacc) {
              await prisma.user.create({
                data: {
                  id: account.account.user_id,
                  name: account.account.first_name,
                  email: account.account.email,
                  phone: account.account.phone,
                },
              });
              await prisma.account.create({
                data: {
                  provider: "loan_service",
                  userId: account.account!.user_id,
                  type: "loan_service",
                  providerAccountId: account.account!.user_id,
                  id_token: cookie,
                  access_token: token,
                },
              });
            } else {
              await prisma.account.update({
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
              bank_account: account?.bank_account,
              id_token: cookie,
              access_token: token,
            };
          }
        } else {
          throw new Error(encodeURIComponent(user.description));
        }

        return null;
      },
    }),
  ],

  pages: {
    error: "/login",
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"] | any;
  res: GetServerSidePropsContext["res"] | any;
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
