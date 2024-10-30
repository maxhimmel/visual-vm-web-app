import { SignedIn } from "@/app/_components/signedIn";
import { SignedOut } from "@/app/_components/signedOut";
import { getServerAuthSession } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <div className="hero">
          <div className="hero-content flex flex-col">
            <h1 className="text-6xl">Welcome to Viz Voicemail</h1>
            <SignedOutPrompt />
            <SignedInPrompt />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

function SignedOutPrompt() {
  return (
    <SignedOut>
      <p className="text-lg">Login or sign up to get started.</p>
      <Link className="btn btn-lg" href="/api/auth/signin">
        Login
      </Link>
    </SignedOut>
  );
}

async function SignedInPrompt() {
  const session = await getServerAuthSession();
  const voicemail =
    session && session.user ? await api.account.getVoicemail() : null;

  return (
    <SignedIn>
      {voicemail ? (
        <Link href="/vm" className="btn btn-lg">
          View voicemails
        </Link>
      ) : (
        <form
          className="flex flex-col gap-4"
          action={async (formData) => {
            "use server";

            const data = voicemailFormSchema.parse(
              Object.fromEntries(formData),
            );

            const userNumber = data.userNumber.replaceAll("-", "");
            const vmNumber = data.vmNumber.replaceAll("-", "");

            await api.account.setVoicemail({
              userNumber,
              voicemailNumber: vmNumber,
              voicemailPin: data.vmPin,
            });

            redirect("/vm");
          }}
        >
          <label>
            Your phone number:
            <br />
            <i>Format (123-456-7890)</i>
            <br />
            <input
              type="tel"
              id="userNumber"
              name="userNumber"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              minLength={12}
              maxLength={12}
              required
            />
          </label>

          <label>
            Voicemail number:
            <br />
            <i>Format (123-456-7890)</i>
            <br />
            <input
              type="tel"
              id="vmNumber"
              name="vmNumber"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              minLength={12}
              maxLength={12}
              required
            />
          </label>

          <label>
            Voicemail pin:
            <br />
            <input type="password" id="vmPin" name="vmPin" required />
          </label>

          <button type="submit" className="btn btn-lg">
            Submit
          </button>
        </form>
      )}
    </SignedIn>
  );
}

const voicemailFormSchema = z.object({
  userNumber: z.string().length(12),
  vmNumber: z.string().length(12),
  vmPin: z.string(),
});
