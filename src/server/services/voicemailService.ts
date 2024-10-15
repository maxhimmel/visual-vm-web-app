import { AppService, VmCredentials, VmRecording } from "@/server/services/appService";

export class VoicemailService extends AppService {
    async createVoicemailCredentials(credentials: VmCredentials) {
        await this.db.voicemail.create({
            data: credentials
        });
    }

    async getVoicemailCredentials(userId: string) {
        return await this.db.voicemail.findUnique({
            where: {
                userId: userId
            },
        });
    }

    async createCallLog(id: { userId: string; callId: string; }) {
        return await this.db.callLog.create({
            data: {
                userId: id.userId,
                callId: id.callId
            }
        });
    }

    async addRecordingLog(params: { callId: string; entryId: string; calledAt: string; }) {
        return await this.db.callLog.update({
            where: {
                callId: params.callId
            },
            data: {
                recordings: {
                    push: {
                        entryId: params.entryId,
                        approxDate: params.calledAt,
                    }
                }
            }
        });
    }

    async addRecordingLookup(params: { callId: string; entryId: string; recordingId: string; }) {
        return await this.db.callLog.update({
            where: {
                callId: params.callId
            },
            data: {
                recordings: {
                    updateMany: {
                        where: {
                            entryId: params.entryId
                        },
                        data: {
                            recordingId: params.recordingId
                        }
                    }
                }
            }
        });
    }

    async deleteRecording(recordingId: string) {
        const recording = await this.storage.deleteRecording(recordingId);

        const callLog = await this.db.callLog.update({
            where: { callId: recording.callSid },
            data: {
                recordings: {
                    deleteMany: {
                        where: {
                            recordingId
                        }
                    }
                }
            }
        });

        if (callLog.recordings.length <= 0) {
            await this.db.callLog.delete({
                where: { callId: recording.callSid }
            });
        }
    }

    async getVoicemails(userId: string) {
        const calls = await this.db.callLog.findMany({
            where: {
                userId
            }
        });
        const userRecordingMeta = new Map(
            calls.flatMap(c => c.recordings)
                .map(r => [r.recordingId, r])
        );

        const globalRecordings = await this.storage.getAllRecordings();
        const userRecordings = globalRecordings.filter(r => userRecordingMeta.has(r.sid));

        const results: VmRecording[] = [];

        for (const r of userRecordings) {
            const transcriptions = await r.transcriptions().list();
            const transcript = transcriptions.map(t => t.transcriptionText).join(" ");

            const meta = userRecordingMeta.get(r.sid);
            const calledAt = meta?.approxDate ?? "unknown";

            results.push({
                callId: r.callSid,
                recordingId: r.sid,
                mediaUrl: r.mediaUrl,
                duration: r.duration,
                calledAt,
                transcript,
            });
        }

        return results;
    }
}