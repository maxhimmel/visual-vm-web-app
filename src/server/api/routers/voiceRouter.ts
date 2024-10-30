import { env } from "@/env";
import { TwimlHelpers } from "@/lib/twimlHelpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio, twiml as TWIML } from "twilio";

export const voiceRouter = createTRPCRouter({
    dialVoicemail: protectedProcedure
        .mutation(async ({ ctx }) => {
            const voicemail = await ctx.vmService.getVoicemailCredentials(ctx.session.user.id);
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            let twiml = new TWIML.VoiceResponse();

            twiml = TwimlHelpers.loginVm({
                twiml,
                userNumber: voicemail?.userNumber!,
                vmPin: voicemail?.vmPin!
            });

            twiml.gather({
                input: ["speech"],
                speechTimeout: "1",
                hints: "received, at",
                action: `${env.API_URL}/webhooks/start-recording`,
            });

            const call = await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${voicemail?.vmNumber}`,
                twiml,
                // timeLimit: 180, // for testing to make sure it doesn't run forever
            });

            const log = await ctx.vmService.createCallLog({
                userId: ctx.session.user.id,
                callId: call.sid,
            });

            return log;
        })
});