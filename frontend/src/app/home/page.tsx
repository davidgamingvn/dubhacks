"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Plus } from "lucide-react";
import { Suspense, useState } from "react";
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
import { useToast } from "~/hooks/use-toast";

interface Event {
  name: string;
  from: string;
  to: string;
}

export default function HomeworkScheduler() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [additionalEvents, setAdditionalEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { user } = useUser();
  const { toast } = useToast();
  const userId = user?.sub ? user.sub.split("|")[1] : null;

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
    setIsLoading(true); // Set loading state to true

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
        `http://localhost:4000/api/uploadhomework/${userId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit homework");
      }

      const newEvents = (await response.json()) as Event[];
      setAdditionalEvents((prevEvents) => [...prevEvents, ...newEvents]);

      toast({
        title: "Homework submitted successfully",
        description: "Your profile is already created. Redirecting to homepage",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting homework:", error);
      toast({
        variant: "destructive",
        title: `${error instanceof Error ? error.message : String(error)}`,
        description: "Homework submitted unsuccessfully, ",
        duration: 3000,
      });
      alert("Error submitting homework");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] dark:bg-slate-700">
      <Suspense fallback={<Spinner />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Card className="border border-[#1E1E1E] bg-white dark:bg-gray-800">
          <CardHeader className="rounded-t-xl border-b border-[#1E1E1E] bg-[#FAF17C] px-6 py-4 text-2xl font-normal tracking-wider dark:text-slate-800">
            <p>
              Hello{" "}
              <span className="inline font-semibold">
                {user?.name ?? "User"}
              </span>
              ! Here is your homework schedule this week:
            </p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <WeeklyCalendar additionalEvents={additionalEvents} />
            </Suspense>
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-6 right-6">
        <Dialog>
          <DialogTrigger>
            <Button className="z-index: 9999; size-24 rounded-full bg-[#1E1E1E] hover:bg-[#E6D85F] hover:text-white dark:bg-[#FAF17C] hover:dark:bg-[#1E1E1E]">
              <Plus className="z-index: 9999; h-12 w-12" />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-none bg-[#FFFFFA] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-4xl text-[#1E1E1E]">
                Add your homework
              </DialogTitle>
              <DialogDescription>
                Add your latest homework and its deadline, and we&apos;ll make
                your schedule!!!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture" className="text-[#1E1E1E]">
                  File
                </Label>
                <Input
                  id="picture"
                  type="file"
                  className="text-[#1E1E1E]"
                  onChange={handleFileChange}
                  required
                />
                <Separator orientation="horizontal" className="mb-4 mt-4" />
                <Label htmlFor="date" className="text-[#1E1E1E]">
                  Deadline
                </Label>
                <DatePicker
                  selected={date}
                  onSelect={(date) => setDate(date ?? null)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="medium" /> : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
