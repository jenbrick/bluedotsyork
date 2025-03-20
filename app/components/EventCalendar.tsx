"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { supabase } from "@/lib/supabaseClientGD";
import { EventClickArg } from "@fullcalendar/core";

import { FaPencilAlt } from "react-icons/fa"; // ✅ Alternative: Pencil icon


type EventType = {
  id: string;
  title: string;
  start: string;
  end?: string;
  location?: string;
  details?: string;
};

type EventCalendarProps = {
  isEditable: boolean;
};

const EventCalendar: React.FC<EventCalendarProps> = ({ isEditable }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar"); // Default to Calendar View

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) console.error("Error fetching events:", error);
      else setEvents(data as EventType[]);
    };

    fetchEvents();

    // ✅ Detect mobile screens and update state
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [events]);

  useEffect(() => {
    const checkMobile = () => {
      const mobileStatus = window.innerWidth <= 768;
      setIsMobile(mobileStatus);
    };

    // Run once on mount
    checkMobile();

    // ✅ Listen for window resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDateClick = (info: { dateStr: string }) => {
    const filteredEvents = events.filter((event) => event.start.startsWith(info.dateStr));

    if (filteredEvents.length > 0) {
      setSelectedDay(info.dateStr);
      setDayEvents(filteredEvents);
      setSelectedEvent(null); // Ensure event selection doesn't conflict
    } else {
      setSelectedDay(null);
      setDayEvents([]);
    }
  };


  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: new Date(info.event.start as unknown as string).toLocaleString(),
      end: info.event.end ? new Date(info.event.end as unknown as string).toLocaleString() : "N/A",
      location: info.event.extendedProps.location as string | undefined,
      details: info.event.extendedProps.details as string | undefined,
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <h1 className="calendar-title">Blue Dots Event Calendar</h1>
      {/* Toggle Button for Desktop Users */}



      {/* ✅ Prioritize List View First */}
      <div className="calendar-container">
        {/* ✅ Floating Compose Button inside the calendar */}
        {true && (
          <button className="floating-edit-button">
            <FaPencilAlt size={20} />
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button
            className="toggle-view-button"
            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
          >
            {viewMode === "calendar" ? "View all Upcoming Events" : "Go to Calendar View"}
          </button>
          {viewMode === "list" && (
            <button className="print-button" onClick={() => window.print()}>
              Print List
            </button>
          )}
        </div>
        {viewMode === "list" ? (
          <div className="event-list-container">
            <h3 className="event-list-title">Upcoming Events</h3>
            <ul className="event-list">
              {events
                .filter((event) => new Date(event.start) >= new Date()) // ✅ Hide past events
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // ✅ Sort by upcoming events
                .map((event) => {
                  const startDate = new Date(event.start);
                  const endDate = event.end && new Date(event.end).toString() !== "Invalid Date" ? new Date(event.end) : null;

                  return (
                    <li key={event.id} className="event-list-item">
                      <strong>{event.title}</strong><br />

                      {/* 📅 Display Date */}
                      <p>
                        📅 {startDate.toLocaleDateString()}
                        {endDate && startDate.toLocaleDateString() !== endDate.toLocaleDateString()
                          ? ` - ${endDate.toLocaleDateString()}`
                          : ""}
                      </p>

                      {/* ⏰ Display Time Below Date */}
                      <p>
                        ⏰{" "}
                        {endDate && startDate.toLocaleDateString() === endDate.toLocaleDateString()
                          ? `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`
                          : endDate
                            ? `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`
                            : `${startDate.toLocaleTimeString()}`}
                      </p>

                      {event.location && <div>📍 {event.location}</div>}
                      {event.details && <div>📝 {event.details}</div>}
                    </li>
                  );
                })}
            </ul>

            {events.filter((event) => new Date(event.start) >= new Date()).length === 0 && <p>No upcoming events.</p>}
          </div>
        ) : isMobile ? (
          <FullCalendar
            key={events.length}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next"
            }}
            dayCellClassNames={(info) => {
              const formattedDate = info.date.toISOString().split("T")[0]; // ✅ Convert to YYYY-MM-DD
              console.log("Checking date:", formattedDate);

              const hasEvent = events.some(event => event.start.startsWith(formattedDate));

              return hasEvent ? "fc-day-has-event" : "";
            }}
            events={events} //.map(event => ({ ...event, display: "background" }))}
            dateClick={handleDateClick}
            eventClick={isMobile ? () => { } : handleEventClick} // Ensures no effect on mobile
            eventContent={(eventInfo) => {
              if (eventInfo.view.type === "dayGridMonth") {
                return (
                  <div className="fc-event-custom">
                    {eventInfo.event.title}
                  </div>
                );
              }
              return undefined;
            }}
          />
        ) : (
          <FullCalendar
            key={events.length}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            timeZone="local"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={isMobile ? () => { } : handleEventClick} // Ensures no effect on mobile
            editable={isEditable}
            eventContent={(eventInfo) => {
              if (eventInfo.view.type === "dayGridMonth") {
                return (
                  <div className="fc-event-custom">
                    {eventInfo.event.title}
                  </div>
                );
              }
              return undefined;
            }}
          />
        )}
      </div>

      {/* ✅ Modal for Viewing All Events on a Selected Day (Mobile & Desktop) */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* ✅ 'X' Close Button in Upper Right */}
            <button className="modal-close-button" onClick={() => setSelectedDay(null)}>✖</button>

            <h3 className="modal-title">Events for {selectedDay}</h3>
            <ul className="modal-event-list">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <li key={event.id} className="modal-event-item">
                    <div className="event-info">
                      <strong>{event.title}</strong>
                      <p>📅 {new Date(event.start).toLocaleDateString()}</p>
                      <p>⏰ {new Date(event.start).toLocaleTimeString()}
                        {event.end && ` - ${new Date(event.end).toLocaleTimeString()}`}
                      </p>
                      {event.location && <p>📍 {event.location}</p>}
                      {event.details && <p>📝 {event.details}</p>}
                    </div>

                    {/* ✅ Show Edit Button if Editable */}
                    {true && (
                      <button className="event-edit-button">
                        ✏️ Edit
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p>No events on this day.</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* ✅ 'X' Close Button in Upper Right */}
            <button className="modal-close-button" onClick={() => setSelectedEvent(null)}>✖</button>

            <h3 className="modal-title">{selectedEvent.title}</h3>
            <p className="modal-date">
              📅 {new Date(selectedEvent.start).toLocaleDateString()}
              {selectedEvent.end &&
                selectedEvent.end !== "N/A" &&
                new Date(selectedEvent.end).toString() !== "Invalid Date" &&
                new Date(selectedEvent.start).toLocaleDateString() !== new Date(selectedEvent.end).toLocaleDateString()
                ? ` - ${new Date(selectedEvent.end).toLocaleDateString()}`
                : ""}
            </p>

            <p className="modal-time">
              ⏰ {new Date(selectedEvent.start).toLocaleTimeString()}
              {selectedEvent.end && ` - ${new Date(selectedEvent.end).toLocaleTimeString()}`}
            </p>

            {selectedEvent.location && <p className="modal-location">📍 {selectedEvent.location}</p>}
            {selectedEvent.details && (
              <p className="modal-details">
                🔗 {selectedEvent.details.split(" ").map((word, index) =>
                  word.startsWith("http") ? (
                    <a key={index} href={word} target="_blank" rel="noopener noreferrer">
                      {word}
                    </a>
                  ) : (
                    word + " "
                  )
                )}
              </p>
            )}

            {/* ✅ Show Edit Button if Editable */}
            {true && (
              <button className="event-edit-button">
                ✏️ Edit Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
