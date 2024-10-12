import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio } from "twilio";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
    getVoicemail: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.voicemail;
        }),

    setVoicemail: protectedProcedure
        .input(z.object({
            userNumber: z.string().length(10),
            voicemailNumber: z.string().length(10),
            voicemailPin: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const newVm = await ctx.db.voicemail.create({
                data: {
                    userId: ctx.session.user.id,
                    userNumber: input.userNumber,
                    vmNumber: input.voicemailNumber,
                    vmPin: input.voicemailPin
                }
            });

            return newVm;
        }),

    deleteVoicemail: protectedProcedure
        .input(z.object({
            recordingId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            const recording = await client.recordings(input.recordingId).fetch();
            const transcriptions = await recording.transcriptions().list();

            await recording.remove();
            for (const t of transcriptions) {
                await t.remove();
            }

            // TODO: don't forget to remove the callLog.recordings entry

            const callId = recording.callSid;
            const call = await client.calls(callId).fetch();
            const remainingRecordings = await call.recordings().list();
            if (remainingRecordings.length === 0) {
                await call.remove();
                await ctx.db.callLog.delete({
                    where: {
                        callId
                    }
                });
            }
        }),
});