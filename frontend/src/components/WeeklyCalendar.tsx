// components/WeeklyCalendar.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import interactionPlugin from "@fullcalendar/interaction"; // needed for user interactions
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // for week and day views
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { getRandomColor } from "~/lib/utils";
import "~/styles/globals.css"; // Import custom CSS

interface UserData {
  constraints: Constraint[];
  name: string;
  subjectRatings: {
    math: number;
    science: number;
    history: number;
    english: number;
    art: number;
    physicalEducation: number;
    music: number;
  };
}

interface Constraint {
  name: string;
  days: number[];
  from: string;
  to: string;
  _id?: string;
  color?: string;
}

interface Event {
  name: string;
  from: string;
  to: string;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface WeeklyCalendarProps {
  additionalEvents: Event[];
}

export default function WeeklyCalendar({ additionalEvents }: WeeklyCalendarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    start: Date;
    end: Date;
  } | null>(null);
  const { user } = useUser();
  const userId = user?.sub ? user.sub.split("|")[1] : null;

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    async function getProfile() {
      const response = await fetch(
        `http://localhost:4000/api/profile/${userId}`,
        {
          method: "GET",
        },
      );

      const data = (await response.json()) as UserData;

      // Assign a random color to each constraint if it doesn't have one
      const updatedConstraints = data.constraints.map((constraint) => ({
        ...constraint,
        color: constraint.color ?? getRandomColor(),
      }));

      setConstraints(updatedConstraints);
    }
    getProfile().catch((error) => {
      console.error("Failed to fetch profile:", error);
    });
  }, [user, userId]);

  const generateEvents = () => {
    const events: {
      title: string;
      start: Date;
      end: Date;
      backgroundColor: string;
      borderColor: string;
      className: string;
    }[] = [];
    const currentDate = moment(); // Today’s date
    days.forEach((day, index) => {
      constraints.forEach((constraint) => {
        if (constraint.days.includes(index)) {
          const startOfWeek = currentDate.clone().startOf("week");
          const eventStart = startOfWeek
            .clone()
            .day(index)
            .set({
              hour: parseInt(constraint.from?.split(":")[0] ?? "0"),
              minute: parseInt(constraint.from?.split(":")[1] ?? "0"),
            })
            .toDate();
          const eventEnd = startOfWeek
            .clone()
            .day(index)
            .set({
              hour: parseInt(constraint.to?.split(":")[0] ?? "0"),
              minute: parseInt(constraint.to?.split(":")[1] ?? "0"),
            })
            .toDate();
          events.push({
            title: constraint.name,
            start: eventStart,
            end: eventEnd,
            backgroundColor: constraint.color ?? "#443fea",
            borderColor: constraint.color ?? "#ffffff",
            className: "custom-event",
          });
        }
      });
    });

    // Add additional events
    additionalEvents.forEach((event) => {
      events.push({
        title: event.name,
        start: new Date(event.from),
        end: new Date(event.to),
        backgroundColor: getRandomColor(),
        borderColor: "#ffffff",
        className: "custom-event",
      });
    });

    return events;
  };

  const events = generateEvents();

  const handleEventClick = (clickInfo: {
    event: { title: string; start: Date | null; end: Date | null };
  }) => {
    if (clickInfo.event.start && clickInfo.event.end) {
      setSelectedEvent({
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
      });
    }
    setIsDialogOpen(true);
  };

  const renderEventContent = (eventInfo: { event: { title: string } }) => {
    return (
      <div className="flex h-full items-center justify-center text-lg tracking-wide">
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="custom-scrollbar h-[400px] w-full overflow-y-auto bg-white p-4">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek",
        }}
        slotMinTime="06:00:00"
        editable={false}
        allDaySlot={false}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.8}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: "short",
        }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }}
        eventClick={handleEventClick}
        eventContent={renderEventContent} // Custom event rendering
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <>
                  <p>
                    Start:{" "}
                    {moment(selectedEvent.start).format("MMMM D, YYYY h:mm A")}
                  </p>
                  <p>
                    End:{" "}
                    {moment(selectedEvent.end).format("MMMM D, YYYY h:mm A")}
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}