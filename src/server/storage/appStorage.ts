import { RecordingInstance } from "twilio/lib/rest/api/v2010/account/recording";

export abstract class AppStorage {
    abstract deleteRecording(recordingId: string): Promise<RecordingInstance>;
    abstract getAllRecordings(): Promise<RecordingInstance[]>;
}