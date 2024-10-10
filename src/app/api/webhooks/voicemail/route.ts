import { TwimlHelpers } from "@/lib/twimlHelpers";
import { NextRequest } from "next/server";
import { twiml as TWIML } from "twilio";
import { z } from "zod";

const apiDomain = "ngrok";
const recordingCallback = `${apiDomain}/api/webhooks/record`;
const transcriptionCallback = `${apiDomain}/api/webhooks/transcribe`;

const gatherRequestSchema = z.object({
    SpeechResult: z.string(),
    Confidence: z.number({ coerce: true }).optional(),
});
const recordRequestSchema = z.object({
    RecordingUrl: z.string(),
    RecordingDuration: z.number({ coerce: true }),
    Digits: z.string().optional(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const data = gatherRequestSchema.safeParse(
        Object.fromEntries(formData)
    );

    console.log({ rawForm: formData, parsedForm: data });

    if (!data.success) {
        return new Response(null, { status: 400 });
    }

    let twiml = new TWIML.VoiceResponse();

    // twiml.pause({
    //     length: 2,
    // });

    twiml.record({
        recordingStatusCallback: recordingCallback,
        transcribeCallback: transcriptionCallback,
        maxLength: 120, // Twilio's max transcription length.
        playBeep: false,
        transcribe: true,
        trim: "trim-silence",
        action: `${apiDomain}/api/webhooks/delete-voicemail`,
    });

    return new Response(
        twiml.toString(),
        { headers: { "Content-Type": "text/xml" } }
    );
}