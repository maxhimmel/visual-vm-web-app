import { NextRequest } from "next/server";
import { z } from "zod";

const recordingCallbackSchema = z.object({
    RecordingSid: z.string(),
    RecordingUrl: z.string(),
    RecordingStatus: z.enum(["completed", "failed"]),
    CallSid: z.string(),
    RecordingStartTime: z.date(),
    RecordingDuration: z.number(),
    AccountSid: z.string(),
    ErrorCode: z.number(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const data = recordingCallbackSchema.parse(body);

    console.log(data);

    return new Response(null, { status: 204 });
}