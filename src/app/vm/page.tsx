import { api, HydrateClient } from "@/trpc/server";

export default async function Voicemails() {
  const recordings = await api.voice.getRecordings();

  return (
    <HydrateClient>
      <main>
        <div className="hero">
          <div className="hero-content flex flex-col">
            <form
              action={async (formData) => {
                "use server";

                console.log("Dialing voicemail...");
                await api.voice.dialVoicemail();
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

                console.log("Dialing user...");
                await api.voice.callUser();
                console.log("Dialed user.");
              }}
            >
              <button type="submit" className="btn btn-ghost btn-lg">
                Call User
              </button>
            </form>

            <div>
              <h2 className="text-4xl">Recordings</h2>
              <ul className="space-y-4">
                {recordings.map((recording) => (
                  <li key={recording.callId}>
                    <audio controls>
                      <source
                        src={`${recording.mediaUrl}.mp3`}
                        type="audio/mp3"
                      />
                    </audio>
                    <code>{recording.transcript}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
