import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SinchClient } from "@sinch/sdk-core";

export const voiceRouter = createTRPCRouter({
    makeCall: protectedProcedure
        .query(async ({ ctx }) => {
            const sinchClient = new SinchClient({
                applicationKey: env.SINCH_APP_KEY,
                applicationSecret: env.SINCH_APP_SECRET,
            });

            const sinchNumber = "+anon";
            const vmNumber = "+anon";

            const response = await sinchClient.voice.callouts.tts({
                ttsCalloutRequestBody: {
                    method: "ttsCallout",
                    ttsCallout: {
                        cli: sinchNumber,
                        destination: {
                            type: "number",
                            endpoint: vmNumber,
                        },
                        text: "This is a test call from Sinch using the Node.js SDK.",
                    },
                },
            });

            console.log(JSON.stringify(response));
        }),
});