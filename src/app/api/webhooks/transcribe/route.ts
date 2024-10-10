import { NextRequest } from "next/server";
import { z } from "zod";

const transcriptionCallbackSchema = z.object({
    RecordingSid: z.string(),
    RecordingUrl: z.string(),
    RecordingStatus: z.enum(["completed", "failed"]),
    CallSid: z.string(),
    RecordingStartTime: z.string(),
    RecordingDuration: z.string(),
    AccountSid: z.string(),
    ErrorCode: z.string(),
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    // const data = transcriptionCallbackSchema.parse(
    //     Object.fromEntries(formData)
    // );

    console.log("transcription", formData);

    return new Response(null, { status: 204 });
}