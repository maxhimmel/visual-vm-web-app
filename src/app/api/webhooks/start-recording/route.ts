import { env } from "@/env";
import { db } from "@/server/db";
import { NextRequest } from "next/server";
import { twiml as TWIML } from "twilio";
import { z } from "zod";

const gatherRequestSchema = z.object({
    CallSid: z.string(),
    SpeechResult: z.string(),
    Confidence: z.number({ coerce: true }).optional(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const data = gatherRequestSchema.safeParse(
        Object.fromEntries(formData)
    );

    console.log({ rawForm: formData, parsedForm: data });

    if (!data?.success) {
        console.error("Invalid form data:", data?.error);
        return new Response(null, { status: 400 });
    }

    let twiml = new TWIML.VoiceResponse();

    if (data.data.SpeechResult.includes("main menu")) {
        console.log("hanging up. goodbye.");
        twiml.hangup();
    }
    else {
        const approxDate = parseDate(data.data.SpeechResult);
        const recEntryId = crypto.randomUUID();

        void (async () => {
            await db.callLog.update({
                where: {
                    callId: data.data.CallSid
                },
                data: {
                    recordings: {
                        push: {
                            entryId: recEntryId,
                            approxDate,
                        }
                    }
                }
            });
        })();

        twiml.record({
            recordingStatusCallback: `${env.API_URL}/webhooks/record?entryId=${recEntryId}`,
            // Transcribe callback: cool for logging, but not immediately useful. Maybe, when we need to know when ALL operations have completed?
            // transcribeCallback: `${env.API_URL}/webhooks/transcribe`,
            maxLength: 120, // Twilio's max transcription length.
            playBeep: false,
            transcribe: true,
            trim: "trim-silence",
            action: `${env.API_URL}/webhooks/delete-voicemail`,
        });
    }

    return new Response(
        twiml.toString(),
        { headers: { "Content-Type": "text/xml" } }
    );
}

function parseDate(gatherData: string) {
    const token = "received";
    const receivedIndex = gatherData.indexOf(token);
    let approxDate = gatherData.slice(receivedIndex + token.length).trim();

    if (approxDate.includes("today")) {
        const today = new Date();
        approxDate = approxDate.replace("today", today.toLocaleDateString());
    }
    else if (approxDate.includes("yesterday")) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        approxDate = approxDate.replace("yesterday", yesterday.toLocaleDateString());
    }

    return approxDate;
}