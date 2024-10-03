import { env } from "@/env";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SinchClient, Voice } from "@sinch/sdk-core";

export const voiceRouter = createTRPCRouter({
    ttsCall: protectedProcedure
        .input(z.object({
            text: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const sinchClient = new SinchClient({
                applicationKey: env.SINCH_APP_KEY,
                applicationSecret: env.SINCH_APP_SECRET,
            });

            const response = await sinchClient.voice.callouts.tts({
                ttsCalloutRequestBody: {
                    method: "ttsCallout",
                    ttsCallout: {
                        cli: env.SINCH_PHONE_NUMBER,
                        destination: {
                            type: "number",
                            endpoint: vmNumber,
                        },
                        text: input.text,
                    },
                },
            });

            console.log(JSON.stringify(response));

            return { callId: response.callId };
        }),

    testVoice: protectedProcedure
        .query(async ({ ctx }) => {
            const sinchClient = new SinchClient({
                applicationKey: env.SINCH_APP_KEY,
                applicationSecret: env.SINCH_APP_SECRET,
            });

            const response = await sinchClient.voice.callouts.custom({
                customCalloutRequestBody: {
                    method: "customCallout",
                    customCallout: {
                        cli: sinchNumber,
                        // dtmf: "",
                        destination: {
                            type: "number",
                            endpoint: vmNumber,
                        },
                        ace: JSON.stringify(new Voice.AceSvamletBuilder()
                            .addInstruction(Voice.aceInstructionHelper.say("Howdy there, bud."))
                            .setAction(Voice.aceActionHelper.continue())
                            .build()),
                    }
                }
            });

            await sinchClient.voice.calls.update({
                callId: response.callId as string,
                updateCallRequestBody: {
                    instructions: [
                        Voice.svamlInstructionHelper.buildSay("well hello again.")
                    ],
                    action: Voice.svamlActionHelper.buildContinue()
                }
            });

            await sinchClient.voice.calls.update({
                callId: response.callId as string,
                updateCallRequestBody: {
                    instructions: [
                        Voice.svamlInstructionHelper.buildSay("and now we're done. goodbye.")
                    ],
                    action: Voice.svamlActionHelper.buildHangup()
                }
            });

            return { callId: response.callId };
        })
});