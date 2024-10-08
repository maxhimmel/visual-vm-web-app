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
    const data = recordingCallbackSchema.parse(
        Object.fromEntries(formData)
    );

    // retrieve call sid from db

    // update call recording log using call sid to make new entry for
    // user in db
    // client.calls.get(data.CallSid).recordings
    console.log(data);

    return new Response(null, { status: 204 });
}