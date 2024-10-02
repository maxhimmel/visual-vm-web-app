import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <form
          action={async (formData) => {
            "use server";

            console.log("Dialing voicemail...");
            await api.voice.makeCall();
            console.log("Voicemail dialed.");
          }}
        >
          <button type="submit" className="btn btn-lg">
            Dial Voicemail
          </button>
        </form>
      </main>
    </HydrateClient>
  );
}
