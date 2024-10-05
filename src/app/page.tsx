import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
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
                await api.voice.testCall();
                console.log("Voicemail dialed.");
              }}
            >
              <button type="submit" className="btn btn-lg">
                Dial Voicemail
              </button>
            </form>

            <div>
              <h2 className="text-4xl">Recordings</h2>
              <ul className="space-y-4">
                {recordings.map((recording) => (
                  <li key={recording.recording.sid}>
                    <audio controls>
                      <source
                        src={recording.recording.mediaUrl}
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
