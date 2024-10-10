import { env } from "@/env";
import { TwimlHelpers } from "@/lib/twimlHelpers";
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
        return new Response(null, { status: 400 });
    }

    let twiml = new TWIML.VoiceResponse();

    if (data.data.SpeechResult.includes("main menu")) {
        twiml.hangup();
    }
    else {
        twiml.record({
            recordingStatusCallback: `${env.API_URL}/webhooks/record`,
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