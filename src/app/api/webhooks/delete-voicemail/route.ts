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
type ReqType = undefined | z.infer<typeof gatherRequestSchema> | z.infer<typeof recordRequestSchema>;

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const recordData = recordRequestSchema.safeParse(
        Object.fromEntries(formData)
    );
    // we can check the gatherData.Speech result for "main menu" to know all messages have been deleted.
    const gatherData = gatherRequestSchema.safeParse(
        Object.fromEntries(formData)
    );

    const data = recordData.success ? recordData : gatherData.success ? gatherData : undefined;

    console.log({ rawForm: formData, parsedForm: data });

    if (!data?.success) {
        return new Response(null, { status: 400 });
    }

    let twiml = new TWIML.VoiceResponse();

    twiml = TwimlHelpers.deleteVm({ twiml });

    twiml.gather({
        input: ["speech"],
        speechTimeout: "auto",
        hints: "message marked for deletion, new message",
        action: `${apiDomain}/api/webhooks/voicemail`,
    });

    // twiml.gather({
    //     input: ["speech"],
    //     speechTimeout: "auto",
    //     hints: "message marked for deletion, new message",
    // });

    // twiml.pause({
    //     length: 2,
    // });

    // twiml.record({
    //     recordingStatusCallback: recordingCallback,
    //     transcribeCallback: transcriptionCallback,
    //     maxLength: 120, // Twilio's max transcription length.
    //     playBeep: false,
    //     transcribe: true,
    //     trim: "trim-silence",
    //     action: `${apiDomain}/api/webhooks/voicemail`, // because "action" is set, no twiml below will never be reached
    // });

    return new Response(
        twiml.toString(),
        { headers: { "Content-Type": "text/xml" } }
    );
}