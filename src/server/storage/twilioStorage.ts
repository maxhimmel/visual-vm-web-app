import { env } from "@/env";
import { AppStorage } from "@/server/storage/appStorage";
import { Twilio } from "twilio";

export class TwilioStorage extends AppStorage {
    private storage = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

    async deleteRecording(recordingId: string) {
        const recording = await this.storage.recordings(recordingId).fetch();
        const transcriptions = await recording.transcriptions().list();

        await recording.remove();
        for (const t of transcriptions) {
            await t.remove();
        }

        const call = await this.storage.calls(recording.callSid).fetch();
        const remainingRecordings = await call.recordings().list();

        if (remainingRecordings.length <= 0) {
            await call.remove();
        }

        return recording;
    }

    async getAllRecordings() {
        return await this.storage.recordings.list();
    }
}