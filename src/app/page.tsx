import { HydrateClient } from "~/trpc/server";
import ColorWheel from "./_components/color-wheel";
import { PlayButton } from "./_components/buttons";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-gradient-to-bl from-amber-100 to-amber-50 to-50% text-white">
        <div className="relative flex w-full items-center justify-center">
          <ColorWheel className="opacity-80 blur-md" />
          <h1 className="absolute select-none text-8xl font-bold text-black/80">
            When is purple, blue?
          </h1>
        </div>
        <PlayButton href="/evaluation" />
      </main>
    </HydrateClient>
  );
}
