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
                to: `+1${ctx.voicemail?.userNumber}`,
                twiml,

                // machineDetectionSpeechEndThreshold,
                // machineDetection,
                // machineDetectionSpeechThreshold
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

    dialVoicemail: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            // TODO: How do we loop this twiml until the voicemail is empty?
            const twiml = new TWIML.VoiceResponse();

            twiml.play({
                digits: `w${ctx.voicemail?.userNumber}#w${ctx.voicemail?.vmPin}#`
            });

            twiml.gather({
                input: ["speech"],
                speechTimeout: "auto",
                hints: "New message"
            });

            twiml.record({
                recordingStatusCallback: recordingCallback,
                maxLength: 120, // Twilio's max transcription length.
                playBeep: false,
                transcribe: true,
                trim: "trim-silence",
            });

            twiml.play({
                digits: `${deleteVm}w`
            });

            twiml.hangup();

            const call = await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${ctx.voicemail?.vmNumber}`,
                twiml,

                //// These are interesting ...
                // machineDetectionSpeechEndThreshold,
                // machineDetection,
                // machineDetectionSpeechThreshold
            });

            const log = await ctx.db.callLog.create({
                data: {
                    callId: call.sid,
                    userId: ctx.session.user.id,
                }
            });

            return log;
        })
});

const saveVm = "1";
const deleteVm = "7";