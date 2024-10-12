import { db } from "@/server/db";
import { NextRequest } from "next/server";
import { z } from "zod";

const recordingCallbackSchema = z.object({
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
    const data = recordingCallbackSchema.parse(
        Object.fromEntries(formData)
    );

    console.log("recording", data);

    const entryId = request.nextUrl.searchParams.get("entryId");
    if (entryId) {
        void (async () => {
            await db.callLog.update({
                where: {
                    callId: data.CallSid
                },
                data: {
                    recordings: {
                        updateMany: {
                            where: {
                                entryId: entryId
                            },
                            data: {
                                recordingId: data.RecordingSid,
                            }
                        }
                    }
                }
            });
        })();
    } else {
        console.error("Cannot log meta data for recording entry without entryId search param.", data);
    }

    return new Response(null, { status: 204 });
}