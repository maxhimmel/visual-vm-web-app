import { env } from "@/env";
import { vmService } from "@/server/db"
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

    const twiml = new TWIML.VoiceResponse();

    if (data.data.SpeechResult.includes("main menu")) {
        console.log("hanging up. goodbye.");
        twiml.hangup();
    }
    else {
        const calledAt = parseDate(data.data.SpeechResult);
        const recEntryId = crypto.randomUUID();

        (async () => {
            await vmService.addRecordingLog({
                entryId: recEntryId,
                callId: data.data.CallSid,
                calledAt,
            });
        })().then(() => console.log("Recording log added."))
            .catch((err) => console.error("Failed to add recording log.", err));

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
        twiml.toString() as string,
        { headers: { "Content-Type": "text/xml" } }
    );
}

function parseDate(gatherData: string) {
    const startToken = "received";
    const receivedIndex = gatherData.indexOf(startToken);
    let approxDate = gatherData.slice(receivedIndex + startToken.length).trim();

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