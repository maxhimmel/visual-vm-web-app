import { AppStorage } from "@/server/storage/appStorage";
import { CallLog, PrismaClient, Voicemail } from "@prisma/client";

export type VmCredentials = Omit<Voicemail, "id">;
export type VmRecording = {
    callId: string;
    recordingId: string;
    mediaUrl: string;
    transcript: string;
    duration: string;
    calledAt: string;
}

export abstract class AppService {
    protected db: PrismaClient;
    protected storage: AppStorage;

    constructor(db: PrismaClient, storage: AppStorage) {
        this.db = db;
        this.storage = storage;
    }

    abstract createVoicemailCredentials(credentials: VmCredentials): Promise<void>;
    abstract getVoicemailCredentials(userId: string): Promise<Voicemail | null>;

    abstract createCallLog(id: {
        userId: string;
        callId: string;
    }): Promise<CallLog>;
    abstract addRecordingLog(params: {
        callId: string;
        entryId: string;
        calledAt: string;
    }): Promise<CallLog>;
    abstract addRecordingLookup(params: {
        callId: string;
        entryId: string;
        recordingId: string;
    }): Promise<CallLog>;

    abstract deleteRecording(recordingId: string): Promise<void>;
    abstract getVoicemails(userId: string): Promise<VmRecording[]>;
}