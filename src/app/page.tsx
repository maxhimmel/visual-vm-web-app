import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <div className="hero">
          <div className="hero-content flex flex-col">
            <form
              action={async (formData) => {
                "use server";

                console.log("Dialing voicemail...");
                await api.voice.ttsCall({
                  text: "Hello, Bah-tee, happy birthday. You are my best bah-tee. I love you.",
                });
                console.log("Voicemail dialed.");
              }}
            >
              <button type="submit" className="btn btn-lg">
                Dial Voicemail
              </button>
            </form>

            <form
              action={async (formData) => {
                "use server";

                console.log("Testing custom call...");
                await api.voice.testVoice();
                console.log("Custom call complete.");
              }}
            >
              <button type="submit" className="btn btn-lg">
                Custom Dial
              </button>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
