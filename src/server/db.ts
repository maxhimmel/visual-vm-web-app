import { PrismaClient } from "@prisma/client";

import { env } from "@/env";
import { VoicemailService } from "@/server/services/voicemailService";
import { TwilioStorage } from "@/server/storage/twilioStorage";
import { AppService } from "@/server/services/appService";

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


export const vmService = new VoicemailService(
  db,
  new TwilioStorage()
) as AppService;