import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Voicemails() {
  const recordings = await api.account.getRecordings();

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

            <div>
              <h2 className="mb-8 text-4xl">Recordings</h2>
              <ul className="space-y-8">
                {recordings.map((recording) => (
                  <li
                    key={recording.recordingId}
                    className="flex flex-col space-y-4 rounded-xl bg-neutral p-4 text-neutral-content"
                  >
                    <div className="flex flex-row items-baseline space-x-4">
                      <p className="font-extralight">{recording.calledAt}</p>
                      <p className="text-sm font-thin">
                        {recording.duration} seconds
                      </p>
                    </div>
                    <div className="flex flex-row space-x-4">
                      <audio
                        className="-mx-1"
                        controls
                        src={`${recording.mediaUrl}.wav`}
                      ></audio>

                      <form
                        className="flex items-center rounded-full bg-white px-3 text-neutral"
                        action={async (formData) => {
                          "use server";

                          console.log("Deleting recording...");
                          await api.account.deleteRecording({
                            recordingId: recording.recordingId,
                          });
                          console.log("Recording deleted.");

                          // refresh the page
                          redirect("/vm");
                        }}
                      >
                        <button type="submit" className="btn btn-ghost btn-sm">
                          Delete
                        </button>
                      </form>
                    </div>
                    <code className="blur-sm">{recording.transcript}</code>
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
