import { env } from "@/env";
import { TwimlHelpers } from "@/lib/twimlHelpers";
import { NextRequest } from "next/server";
import { twiml as TWIML } from "twilio";
import { z } from "zod";

const recordRequestSchema = z.object({
    CallSid: z.string(),
    RecordingUrl: z.string(),
    RecordingDuration: z.number({ coerce: true }),
    Digits: z.string().optional(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const data = recordRequestSchema.safeParse(
        Object.fromEntries(formData)
    );

    console.log({ rawForm: formData, parsedForm: data });

    if (!data?.success) {
        console.error("Invalid form data:", data?.error);
        return new Response(null, { status: 400 });
    }

    let twiml = new TWIML.VoiceResponse();

    twiml = TwimlHelpers.deleteVm({ twiml });

    twiml.gather({
        input: ["speech"],
        speechTimeout: "auto",
        hints: "message marked for deletion, new message, received, at",
        action: `${env.API_URL}/webhooks/log-date`,
    });

    return new Response(
        twiml.toString(),
        { headers: { "Content-Type": "text/xml" } }
    );
}