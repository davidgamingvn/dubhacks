"use client";
import React, { useState } from "react";
import { Afacad } from "next/font/google";
import ConfidenceSlider from "./ConfidenceSlider";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Coffee } from "lucide-react";
export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

type Subject =
  | "math"
  | "science"
  | "history"
  | "english"
  | "art"
  | "Physical Education"
  | "music";

interface Confidences {
  math: number;
  science: number;
  history: number;
  english: number;
  art: number;
  physicalEducation: number;
  music: number;
}

export default function ProfileCreator() {
  const [name, setName] = useState("");
  const [miscText, setMiscText] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const [confidences, setConfidences] = useState<Confidences>({
    math: 50,
    science: 50,
    history: 50,
    english: 50,
    art: 50,
    physicalEducation: 50,
    music: 50,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(confidences);
    const userId = user?.sub ? user.sub.split("|")[1] : null;
    console.log(userId);

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const data = await fetch(`http://localhost:4000/api/profile/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        subjectRatings: confidences,
        constraints: {
          name: "Lunch",
          days: [0, 1, 2, 3, 4, 5, 6],
          from: "12:00",
          to: "13:00",
        },
      }),
    });
    const response = (await data.json()) as {
      success: boolean;
      message: string;
    };
    if (response.success) {
      router.replace("/home");
    }
  }

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    const subject = event.target.attributes.getNamedItem("subject")
      ?.value as Subject;
    const value = parseInt(event.target.value);

    setConfidences((prev) => ({
      ...prev,
      [subject]: value,
    }));
  }

  return (
    <main className="flex h-[100vh] w-[100vw] items-center justify-center overflow-hidden bg-[#FEFCE8]">
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
            <form
              className="mt-7 flex h-full w-full flex-col gap-10"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-9">
                <div className="flex w-1/2 flex-col gap-2">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    className="h-15 rounded-xl border border-[#1E1E1E] bg-[#FFFFFA] p-1 px-2 active:bg-[#FFFFFA]"
                    required
                  ></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Transcript</label>
                  <input
                    type="file"
                    className="h-15 border-[#1E1E1E]"
                    required
                  ></input>
                </div>
              </div>
              <div className="flex h-1/3 flex-col gap-2">
                <label>Anything else you want us to know?</label>
                <textarea
                  className="h-full w-full resize-none rounded-xl border border-[#1E1E1E] bg-[#FFFFFA] p-3"
                  value={miscText}
                  onChange={({ target }) => setMiscText(target.value)}
                ></textarea>
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
            <form className="mt-7 flex h-[70%] w-full flex-col gap-10 overflow-y-scroll pr-6">
              <div className="flex w-full flex-col gap-9">
                {Object.keys(confidences).map((el: string) => {
                  return (
                    <ConfidenceSlider
                      subject={el}
                      value={confidences[el]}
                      change_handler={handleSliderChange}
                    />
                  );
                })}
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
