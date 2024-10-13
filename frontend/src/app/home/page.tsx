"use client";

import { Plus } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import Navbar from "~/components/NavBar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import WeeklyCalendar from "~/components/WeeklyCalendar";
import { useUser } from "@auth0/nextjs-auth0/client";
export default function HomeworkScheduler() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const { user } = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("pdf", file);
    } else {
      throw new Error("No file selected");
    }
    if (date) {
      formData.append("deadline", date.toISOString());
    } else {
      throw new Error("No date selected");
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/uploadhomework/${user?.sub}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit homework");
      }

      alert("Homework submitted successfully!");
    } catch (error) {
      console.error("Error submitting homework:", error);
      alert("Error submitting homework");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] dark:bg-slate-700">
      <Navbar />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Card className="border-none bg-white dark:bg-gray-800">
          <CardHeader className="rounded-t-xl bg-[#FAF17C] p-4 text-2xl font-bold tracking-wider dark:text-slate-800">
            Hello {user?.name ?? "User"}! Here is your homework schedule this
            week:
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <WeeklyCalendar />
            </Suspense>
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger>
            <Button className="h-14 w-14 rounded-full bg-[#FAF17C] hover:bg-[#E6D85F] dark:bg-yellow-600 dark:hover:bg-yellow-700">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-none bg-[#FAF17C]/80 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-4xl">Add your homework</DialogTitle>
              <DialogDescription>
                Add your latest homework and its deadline, and we&apos;ll make
                your schedule!!!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">File</Label>
                <Input
                  id="picture"
                  type="file"
                  className="bg-white"
                  onChange={handleFileChange}
                  required
                />
                <Separator orientation="horizontal" className="mb-4 mt-4" />
                <Label htmlFor="date">Deadline</Label>
                <DatePicker
                  selected={date}
                  onSelect={(date) => setDate(date ?? null)}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
