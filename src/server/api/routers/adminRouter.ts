import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio } from "twilio";

export const adminRouter = createTRPCRouter({
    deleteTranscriptions: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            client.transcriptions.each(async (transcription) => {
                await transcription.remove();
            });
        }),

    deleteRecordings: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            client.recordings.each(async (recording) => {
                await recording.remove();
            });
        }),
});