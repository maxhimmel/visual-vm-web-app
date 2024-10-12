import { twiml as TWIML } from "twilio";

export class TwimlHelpers {
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