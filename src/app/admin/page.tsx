import { api, HydrateClient } from "@/trpc/server";

export default async function Admin() {
  return (
    <HydrateClient>
      <main>
        <div className="hero">
          <div className="hero-content flex flex-col">
            <form
              action={async (formData) => {
                "use server";

                console.log("Dialing user...");
                await api.admin.callUser();
                console.log("Dialed user.");
              }}
            >
              <button type="submit" className="btn btn-accent btn-lg">
                Call User
              </button>
            </form>

            <form
              action={async (formData) => {
                "use server";

                console.log("Deleting all recordings...");
                await api.admin.deleteRecordings();
                console.log("Recordings deleted.");
              }}
            >
              <button type="submit" className="btn btn-primary btn-lg">
                Delete Recordings
              </button>
            </form>

            <form
              action={async (formData) => {
                "use server";

                console.log("Deleting all transcripts...");
                await api.admin.deleteTranscriptions();
                console.log("Transcripts deleted.");
              }}
            >
              <button type="submit" className="btn btn-secondary btn-lg">
                Delete Transcripts
              </button>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
