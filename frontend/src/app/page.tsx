import Link from "next/link";
import Image from "next/image";

import { Afacad } from "next/font/google";

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function HomePage() {
  return (
    <main className="flex h-[100vh] w-[100vw] flex-row">
      <section className="flex h-full w-1/2 flex-col justify-between bg-[#FAF17C] px-[4em] py-[4em] text-[#1E]">
        <div role="presentation">
          <h1
            className={`mb-10 size-28 text-8xl font-semibold ${afacad.className}`}
          >
            Scheduler
          </h1>
          <p className={`text-lg ${afacad.className}`}>
            The AI scheduler to take one thing off your mind
          </p>
        </div>
        <button
          className={`${afacad.className} rounded-md border border-black bg-yellow-50 p-5 hover:bg-slate-100`}
        >
          Log In
        </button>
      </section>
      <section className="flex h-full w-1/2 items-center justify-center bg-yellow-50">
        <Image
          alt="landing page"
          src="/Assets/LandingPageSVG.svg"
          width="2000"
          height="2000"
          className="size-3/4"
        />
      </section>
    </main>
  );
}
