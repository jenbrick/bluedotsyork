"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { supabase } from "@/lib/supabaseClientGD";
import { EventClickArg } from "@fullcalendar/core";

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
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    console.log("Rendering, isMobile:", isMobile);
    checkMobile(); // ✅ Run on initial load
    window.addEventListener("resize", checkMobile); // ✅ Update on resize
  
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDay(info.dateStr);
    const filteredEvents = events.filter((event) => event.start.startsWith(info.dateStr));
    setDayEvents(filteredEvents);
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
      {!isMobile && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button className="toggle-view-button" onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}>
            {viewMode === "calendar" ? "Switch to List View" : "Switch to Calendar View"}
          </button>
          {viewMode === "list" && (
            <button className="print-button" onClick={() => window.print()}>
              Print List
            </button>
          )}
        </div>
      )}

      {/* ✅ Mobile View: Show Only Highlighted Days, Click to Reveal Events */}
      {isMobile ? (
  <div>
    {/* ✅ Mobile View Toggle */}
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <button className="toggle-view-button" onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}>
        {viewMode === "calendar" ? "Switch to List View" : "Switch to Calendar View"}
      </button>
    </div>

    {viewMode === "calendar" ? (
      <FullCalendar
        key={events.length}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false} // ✅ Hide toolbar on mobile
        dayCellClassNames={(info) => {
          const hasEvent = events.some(event => event.start.startsWith(info.dateStr));
          return hasEvent ? "fc-day-has-event" : ""; // ✅ Apply class only if event exists
        }}
        events={events.map((event) => ({
          ...event,
          display: "background", // ✅ Only highlight the day
        }))}
        dateClick={handleDateClick} // ✅ Tap to view events for the day
      />
    ) : (
      <div className="event-list-container">
        <h3 className="event-list-title">Upcoming Events</h3>
        <ul className="event-list">
          {events
            .filter((event) => new Date(event.start) >= new Date()) // ✅ Hide past events
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // ✅ Sort by upcoming events
            .map((event) => (
              <li key={event.id} className="event-list-item">
                <strong>{event.title}</strong><br />
                📅 {new Date(event.start).toLocaleDateString()}  
                ⏰ {new Date(event.start).toLocaleTimeString()} - {event.end ? new Date(event.end).toLocaleTimeString() : "N/A"}
                {event.location && <div>📍 {event.location}</div>}
                {event.details && <div>📝 {event.details}</div>}
              </li>
            ))}
        </ul>
        {events.filter((event) => new Date(event.start) >= new Date()).length === 0 && <p>No upcoming events.</p>}
      </div>
    )}
  </div>
) : viewMode === "calendar" ? (
  <FullCalendar
    key={events.length}
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    timeZone="local"
    headerToolbar={{
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    }}
    events={events}
    dateClick={isEditable || isMobile ? handleDateClick : undefined}
    eventClick={handleEventClick}
    editable={isEditable}
  />
) : (
  <div className="event-list-container">
    <h3 className="event-list-title">Upcoming Events</h3>
    <ul className="event-list">
      {events
        .filter((event) => new Date(event.start) >= new Date()) // ✅ Hide past events
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // ✅ Sort by upcoming events
        .map((event) => (
          <li key={event.id} className="event-list-item">
            <strong>{event.title}</strong><br />
            📅 {new Date(event.start).toLocaleDateString()}  
            ⏰ {new Date(event.start).toLocaleTimeString()} - {event.end ? new Date(event.end).toLocaleTimeString() : "N/A"}
            {event.location && <div>📍 {event.location}</div>}
            {event.details && <div>📝 {event.details}</div>}
          </li>
        ))}
    </ul>
    {events.filter((event) => new Date(event.start) >= new Date()).length === 0 && <p>No upcoming events.</p>}
  </div>
)}


      {/* ✅ Show Events for Selected Day (Mobile Only) */}
      {isMobile && selectedDay && (
        <div className="event-list-container">
          <h3 className="event-list-title">Events for {selectedDay}</h3>
          <ul className="event-list">
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => (
                <li key={event.id} className="event-list-item">
                  <strong>{event.title}</strong><br />
                  📍 {event.location || "No location"} <br />
                  📝 {event.details || "No details"}
                </li>
              ))
            ) : (
              <p>No events on this day.</p>
            )}
          </ul>
        </div>
      )}

      {/* ✅ Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">{selectedEvent.title}</h3>
            <p className="modal-date">
              📅 {selectedEvent.start} - {selectedEvent.end ?? "N/A"}
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
            <div className="modal-buttons">
              <button onClick={() => setSelectedEvent(null)} className="modal-button close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
