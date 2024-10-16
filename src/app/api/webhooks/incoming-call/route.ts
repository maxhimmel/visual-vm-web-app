import { env } from "@/env";
import { vmService } from "@/server/db"
import { NextRequest } from "next/server";
import { twiml as TWIML } from "twilio";
import { z } from "zod";

const incomingCallRequestSchema = z.object({
    CallSid: z.string(),
    From: z.string(),
    FromCity: z.string().optional(),
    FromState: z.string().optional(),
    FromCountry: z.string().optional(),
    CallToken: z.string(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const data = incomingCallRequestSchema.safeParse(
        Object.fromEntries(formData)
    );

    console.log({ rawForm: formData, parsedForm: data });

    const twiml = new TWIML.VoiceResponse();

    // if (!data?.success) {
    // console.error("Invalid form data:", data?.error);

    twiml.say("Something went wrong processing your call. Goodbye.");
    twiml.hangup();
    // }
    // else {
    //     twiml.say("Hello, please leave a message after the beep.");
    //     twiml.record({
    //         playBeep: true,
    //         transcribe: true,
    //         trim: "trim-silence",
    //         maxLength: 120, // The max length of the recording in seconds
    //         recordingStatusCallback: `${env.API_URL}/webhooks/recording-complete`,
    //     });
    //     twiml.hangup();
    // }

    return new Response(
        twiml.toString(),
        { headers: { "Content-Type": "text/xml" } }
    );
}