"use client";
import React from "react";
import { Afacad } from "next/font/google";
import ConfidenceSlider from "./confidenceSlider";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function ProfileCreator() {
  const [name, setName] = useState("");
  const [miscText, setMiscText] = useState("");
  const { user } = useUser();

  const [confidences, setConfidences] = useState({
    math: 50,
    science: 50,
    history: 50,
    english: 50,
    art: 50,
    "Physical Education": 50,
    music: 50,
  });

  async function handleSubmit(event) {
    event.target.preventDefault();
    console.log("Hello");
    const response = await fetch(
      `http://localhost:400/api/profile/create/${user?.sub}`,
      {
        method: "POST",
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
      },
    );
    const data = await response.json();
    console.log(data);
  }

  function handleSliderChange(event) {
    console.log(confidences);
    setConfidences((prev) => {
      const new_obj = {
        ...prev,
        [event.target.attributes.subject.value]: parseInt(event.target.value),
      };
      return new_obj;
    });
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
                <ConfidenceSlider
                  subject="math"
                  value={confidences.math}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="science"
                  value={confidences.science}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="history"
                  value={confidences.history}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="english"
                  value={confidences.english}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="art"
                  value={confidences.art}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="Physical Education"
                  value={confidences["Physical Education"]}
                  change_handler={handleSliderChange}
                />
                <ConfidenceSlider
                  subject="music"
                  value={confidences.music}
                  change_handler={handleSliderChange}
                />
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
