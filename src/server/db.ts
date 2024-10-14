import { PrismaClient } from "@prisma/client";

import { env } from "@/env";
import { VoicemailDb } from "@/server/database/voicemailDB";
import { TwilioStorage } from "@/server/storage/twilioStorage";
import { AppDb } from "@/server/database/appDb";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;


/* --- */


export const appDb = new VoicemailDb(
  db,
  new TwilioStorage()
) as AppDb;