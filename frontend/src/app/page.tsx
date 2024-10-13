"use client";
import { Afacad } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function LandingPage() {
  return (
    <main className="flex h-[100vh] w-[100vw] flex-row">
      <section className="flex h-full w-1/2 flex-col justify-between border bg-[#FAF17C] px-[4em] py-[4em] text-[#1E1E1E]">
        <div role="presentation">
          <h1
            className={`mb-8 size-28 text-8xl font-semibold ${afacad.className}`}
          >
            Scheduler
          </h1>
          <p className={`text-xl ${afacad.className} leading-relaxed`}>
            The AI assisted homework scheduler to help you better manage time
            and resources with your homework and assignments.
          </p>
        </div>
        <Link
          className={`${afacad.className} flex items-center justify-center rounded-lg border border-black bg-yellow-50 p-4 text-lg hover:bg-slate-100`}
          href="api/auth/login"
        >
          <button>Log In</button>
        </Link>
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
