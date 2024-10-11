import { env } from "@/env";
import { TwimlHelpers } from "@/lib/twimlHelpers";
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

        // we don't need to wait for this to finish ...
        db.callLog.update({
            where: {
                callId: data.data.CallSid
            },
            data: {
                approxDate
            }
        });

        twiml.record({
            recordingStatusCallback: `${env.API_URL}/webhooks/record`,
            transcribeCallback: `${env.API_URL}/webhooks/transcribe`,
            maxLength: 120, // Twilio's max transcription length.
            timeout: 10,
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

    // replace "today" within the string with the current date
    if (approxDate.includes("today")) {
        approxDate = approxDate.replace("today", new Date().toLocaleDateString());
    }

    return approxDate;
}