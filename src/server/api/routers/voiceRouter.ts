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

            const callHistory = await ctx.db.callLog.findMany({
                where: {
                    userId: ctx.session.user.id
                }
            });
            const callHistoryLookup = new Map(callHistory.map((call) => [call.callId, call]));

            const recordings = await client.recordings.list();
            const usersRecordings = recordings.filter((recording) => {
                return callHistoryLookup.has(recording.callSid);
            });

            const results = [] as {
                callId: string;
                mediaUrl: string;
                transcript: string;
                duration: string;
                recordingId: string;
                transcriptIds: string[];
            }[];

            for (const r of usersRecordings) {
                const transcriptions = await r.transcriptions().list();
                const transcript = transcriptions.map((t) => t.transcriptionText).join(" ");

                results.push({
                    callId: r.callSid,
                    mediaUrl: r.mediaUrl,
                    transcript,
                    duration: r.duration,
                    recordingId: r.sid,
                    transcriptIds: transcriptions.map((t) => t.sid)
                });
            }

            return results;
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
                action: `${env.API_URL}/webhooks/start-recording`,
            });

            const call = await client.calls.create({
                from: env.TWILIO_PHONE_NUMBER,
                to: `+1${ctx.voicemail?.vmNumber}`,
                twiml,
                // timeLimit: 180, // for testing to make sure it doesn't run forever
            });

            const log = await ctx.db.callLog.create({
                data: {
                    userId: ctx.session.user.id,
                    callId: call.sid,
                }
            });

            return log;
        })
});