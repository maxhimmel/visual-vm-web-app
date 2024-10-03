import { getServerAuthSession } from "@/server/auth";

export async function SignedOut({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (session?.user) {
    return null;
  }

  return <>{children}</>;
}
