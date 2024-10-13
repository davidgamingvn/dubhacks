import React from "react";
import { Afacad } from "next/font/google";

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function ProfileCreator() {
  return (
    <main className="flex h-[100vh] w-[100vw] items-center justify-center bg-[#FEFCE8]">
      <section className="flex size-10/12 flex-col rounded-xl border border-[#1E1E1E] bg-[#FFFFFA] tracking-wide text-[#1E1E1E]">
        <section className="w-full rounded-tl-xl rounded-tr-xl border-b border-[#1E1E1E] bg-[#FAF17C] px-[2em] py-[1em]">
          <h2 className="text-xl font-semibold opacity-60">Profile</h2>
          <h1 className="text-3xl font-semibold">
            Tell us a little about yourself
          </h1>
        </section>
        <div className="flex size-full flex-1 flex-row">
          <section className="h-full w-1/2 p-[2em] py-[2em]">
            <h3 className="font-semibold">Personal Information</h3>
            <hr></hr>
            <form className="mt-7 flex h-full w-full flex-col gap-10">
              <div className="flex gap-9">
                <div className="flex w-1/2 flex-col gap-2">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="h-15 rounded-xl border border-[#1E1E1E] bg-[#FFFFFA] p-1 px-2 active:bg-[#FFFFFA]"
                  ></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Transcript</label>
                  <input type="file" className="h-15 border-[#1E1E1E]"></input>
                </div>
              </div>
              <div className="flex h-1/3 flex-col gap-2">
                <label>Anything else you want us to know?</label>
                <textarea className="h-full w-full rounded-xl border border-[#1E1E1E] bg-[#FFFFFA] p-3"></textarea>
              </div>
              <div className="flex h-1/3 flex-col gap-2">
                <button className="rounded-xl bg-[#1E1E1E] py-3 text-white hover:bg-[#575757]">
                  Create Profile
                </button>
              </div>
            </form>
          </section>
          <section className="h-full w-1/2 px-[2em] py-[1em] pt-[2em]">
            <h3 className="font-semibold">Subject Confidence</h3>
            <hr></hr>
            <form className="mt-7 flex h-full w-full flex-col gap-10">
              <div className="flex w-full flex-col gap-9">
                <div className="flex w-full flex-col gap-2">
                  <label>Math</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    name="name"
                    className="w-full accent-[#1E1E1E]"
                  ></input>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <label>Science</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    name="name"
                    className="w-full accent-[#1E1E1E]"
                  ></input>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <label>History</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    name="name"
                    className="w-full accent-[#1E1E1E]"
                  ></input>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <label>English</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    name="name"
                    className="w-full accent-[#1E1E1E]"
                  ></input>
                </div>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
