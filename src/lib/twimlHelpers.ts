import { env } from "@/env";
import { twiml as TWIML } from "twilio";

const recordingCallback = `${env.API_URL}/webhooks/record`;
const transcriptionCallback = `${env.API_URL}/webhooks/transcribe`;

export class TwimlHelpers {
    static record({
        twiml,
        gatherHints,
        gatherDelay = 2,
        recordingAction,
    }: {
        twiml: TWIML.VoiceResponse;
        gatherHints: string;
        gatherDelay: number;
        recordingAction: string;
    }) {

        twiml.gather({
            input: ["speech"],
            speechTimeout: "auto",
            profanityFilter: false,
            hints: gatherHints,
        });

        twiml.pause({
            length: gatherDelay
        });

        twiml.record({
            recordingStatusCallback: recordingCallback,
            transcribeCallback: transcriptionCallback,
            maxLength: 120, // Twilio's max transcription length.
            playBeep: false,
            transcribe: true,
            trim: "trim-silence",
            action: recordingAction,
        });

        return twiml;
    }

    static deleteVm({ twiml }: { twiml: TWIML.VoiceResponse }) {
        twiml.play({
            digits: `7`,
        });

        return twiml;
    }

    static loginVm({ twiml, userNumber, vmPin }: {
        twiml: TWIML.VoiceResponse,
        userNumber: string,
        vmPin: string
    }) {
        twiml.play({
            digits: `w${userNumber}#w${vmPin}#`
        });

        return twiml;
    }
}