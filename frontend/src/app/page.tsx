import Link from "next/link";
import Image from "next/image";

import { Itim } from "next/font/google";
import { Afacad } from "next/font/google";

export const itim = Itim({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const afacad = Afacad({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function HomePage() {
  return (
    <main className="flex h-[100vh] w-[100vw] flex-row">
      <section className="flex h-full w-1/2 flex-col justify-between bg-[#FFF5B2] p-[5em]">
        <div role="presentation">
          <h1 className={`mb-10 text-7xl ${itim.className}`}>Scheduler</h1>
          <p className="text-lg">
            The AI scheduler to take one thing off your mind
          </p>
        </div>
        <button className="${itim.className} rounded-md bg-orange-400 p-5">
          Log In
        </button>
      </section>
      <section className="flex h-full w-1/2 items-center justify-center bg-orange-100">
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
