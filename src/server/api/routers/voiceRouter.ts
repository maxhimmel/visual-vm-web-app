import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio, twiml as TWIML } from "twilio";
import { RecordingInstance } from "twilio/lib/rest/api/v2010/account/recording";

const vmNumber = "anon";
const recordingCallback = "ngrok";

export const voiceRouter = createTRPCRouter({
    testCall: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            const twiml = new TWIML.VoiceResponse();
            twiml.play({
                digits: "ww9" // (wait 0.5 + 0.5 seconds then play '9' dtmf tone)
            });
            twiml.gather({
                input: ["speech"],
                speechTimeout: "auto",
                hints: "Record this starting now",
            });
            twiml.record({
                transcribe: true,
                trim: "trim-silence",
                // playBeep: false,
                maxLength: 120, // Twilio's max transcription length
                recordingStatusCallback: recordingCallback
            });
            twiml.say("good job with number 1. bye bye.");

            // twiml.play({
            //     digits: "ww9" // (wait 0.5 + 0.5 seconds then play '9' dtmf tone)
            // });
            // twiml.gather({
            //     input: ["speech"],
            //     speechTimeout: "auto",
            //     hints: "Record this starting now",
            // });
            // twiml.record({
            //     transcribe: true,
            //     trim: "trim-silence",
            //     // playBeep: false,
            //     maxLength: 120, // Twilio's max transcription length
            //     recordingStatusCallback: recordingCallback
            // });
            // twiml.say("good job with number 2. goodbye.");

            await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: vmNumber,
                twiml
            }, (error, call) => {
                console.log({ error, call });
            });
        }),

    getRecordings: protectedProcedure
        .query(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            const recordingData = [] as {
                recording: RecordingInstance,
                transcript: string
            }[];

            const recordings = await client.recordings.list();
            for (const r of recordings) {
                const recObj = { recording: r, transcript: "" };

                const transcriptionData = await r.transcriptions().list();
                for (const t of transcriptionData) {
                    recObj.transcript += t.transcriptionText;
                }

                recordingData.push(recObj);
            }

            return recordingData;
        }),
});