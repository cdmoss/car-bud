import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db/client";
import {
  type SignedInAuthObject,
  type SignedOutAuthObject,
  getAuth,
} from "@clerk/nextjs/server";

type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const auth = await getAuth(req);

  return await createContextInner({
    auth,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
