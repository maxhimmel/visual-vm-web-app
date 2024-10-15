import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
    getVoicemail: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.vmService.getVoicemailCredentials(ctx.session.user.id);
        }),

    setVoicemail: protectedProcedure
        .input(z.object({
            userNumber: z.string().length(10),
            voicemailNumber: z.string().length(10),
            voicemailPin: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.vmService.createVoicemailCredentials({
                userId: ctx.session.user.id,
                userNumber: input.userNumber,
                vmNumber: input.voicemailNumber,
                vmPin: input.voicemailPin
            });
        }),

    deleteRecording: protectedProcedure
        .input(z.object({
            recordingId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.vmService.deleteRecording(input.recordingId);
        }),

    getRecordings: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.vmService.getVoicemails(ctx.session.user.id);
        }),
});