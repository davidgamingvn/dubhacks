// components/WeeklyCalendar.tsx
"use client";

import interactionPlugin from "@fullcalendar/interaction"; // needed for user interactions
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // for week and day views
import moment from "moment";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import "~/styles/globals.css"; // Import custom CSS

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const constraints = [
  {
    name: "sleep",
    days: [0, 1, 2, 3, 4, 5, 6],
    from: "22:00",
    to: "06:00",
    color: "#3788d8",
  },
  {
    name: "workout",
    days: [1, 3, 5],
    from: "07:00",
    to: "08:00",
    color: "#28a745",
  },
  {
    name: "study",
    days: [2, 4],
    from: "16:00",
    to: "18:00",
    color: "#ffc107",
  },
];

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
          backgroundColor: constraint.color,
          borderColor: constraint.color,
          className: "custom-event",
        });
      }
    });
  });
  return events;
};

const events = generateEvents();

export default function WeeklyCalendar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    start: Date;
    end: Date;
  } | null>(null);

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
