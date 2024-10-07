import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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
        })
});