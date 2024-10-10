import { env } from "@/env";
import { TwimlHelpers } from "@/lib/twimlHelpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio, twiml as TWIML } from "twilio";
import { RecordingInstance } from "twilio/lib/rest/api/v2010/account/recording";

export const voiceRouter = createTRPCRouter({
    callUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

            const twiml = new TWIML.VoiceResponse();

            twiml.pause({ length: 12 });
            twiml.say("I am leaving me a voicemail. Rabbits with Alice in Wonderland. No internet lifestyle, baby.");
            twiml.hangup();

            await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${ctx.voicemail?.userNumber}`,
                twiml,
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

            let twiml = new TWIML.VoiceResponse();

            twiml = TwimlHelpers.loginVm({
                twiml,
                userNumber: ctx.voicemail?.userNumber as string,
                vmPin: ctx.voicemail?.vmPin as string
            });

            twiml.gather({
                input: ["speech"],
                speechTimeout: "1",
                hints: "received, at",
                action: `${env.API_URL}/webhooks/log-date`,
            });

            const call = await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${ctx.voicemail?.vmNumber}`,
                twiml,
                // timeLimit: 180, // for testing to make sure it doesn't run forever
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