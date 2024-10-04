import { NextApiRequest } from "next";
import { twiml as TWIML } from "twilio";

export async function POST(request: NextApiRequest) {
    const twiml = new TWIML.VoiceResponse();

    twiml.say(
        { voice: "Polly.Giorgio" },
        "Howdy there, partner! This is a test of my Ay Pee Eye."
    );

    twiml.pause({
        length: 1
    });

    twiml.play({
        digits: "9ww1" // (wait 0.5 + 0.5 seconds then play '9' dtmf tone)
    });

    twiml.say(
        { voice: "Polly.Giorgio" },
        "Goodbye, my lovely lovely boy."
    );
    twiml.hangup();


    // twiml.gather({
    //     input: ["speech"],
    //     speechTimeout: "auto",
    //     hints: "New voicemail, voicemail complete, would you like to repeat your message?",
    // });


    return new Response(twiml.toString(), {
        headers: {
            "Content-Type": "text/xml"
        }
    });
}