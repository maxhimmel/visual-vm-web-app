import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio, twiml as TWIML } from "twilio";

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

    callUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            const twiml = new TWIML.VoiceResponse();

            twiml.pause({ length: 12 });
            twiml.say("I am leaving me a voicemail. Rabbits with Alice in Wonderland. No internet lifestyle, baby.");
            twiml.hangup();

            const voicemail = await ctx.vmService.getVoicemailCredentials(ctx.session.user.id);
            await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${voicemail?.userNumber}`,
                twiml,
            });
        }),
});