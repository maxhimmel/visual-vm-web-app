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
                await api.voice.testCall();
                console.log("Voicemail dialed.");
              }}
            >
              <button type="submit" className="btn btn-lg">
                Dial Voicemail
              </button>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
