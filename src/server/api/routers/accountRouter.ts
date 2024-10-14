import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
    getVoicemail: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.getVoicemailCredentials(ctx.session.user.id);
        }),

    setVoicemail: protectedProcedure
        .input(z.object({
            userNumber: z.string().length(10),
            voicemailNumber: z.string().length(10),
            voicemailPin: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.createVoicemailCredentials({
                userId: ctx.session.user.id,
                userNumber: input.userNumber,
                vmNumber: input.voicemailNumber,
                vmPin: input.voicemailPin
            });
        }),

    deleteVoicemail: protectedProcedure
        .input(z.object({
            recordingId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.deleteRecording(input.recordingId);
        }),
});