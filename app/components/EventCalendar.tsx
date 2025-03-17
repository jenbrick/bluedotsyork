"use client";

import React, { useEffect, useState } from "react";
//import Cookies from "js-cookie"; // ✅ Correct import
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid"; // ✅ Import Week/Day View Plugin
import { supabase } from "@/lib/supabaseClientGD";
import { EventClickArg } from "@fullcalendar/core"; // ✅ Import the correct type

type EventType = {
  id: string;
  title: string;
  start: string; // ISO timestamp
  end?: string;  // ISO timestamp
  location?: string;
  details?: string;
};

type EventCalendarProps = {
  isEditable: boolean; // ✅ Define the prop type
};

const EventCalendar: React.FC<EventCalendarProps> = ({ isEditable }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);

  // New Event State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDetails, setNewEventDetails] = useState("");
  //const [dayEvents, setDayEvents] = useState<EventType[]>([]);

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar"); // ✅ Track current view mode

  // Fetch events from Supabase (Refresh when state changes)
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) console.error("Error fetching events:", error);
      else setEvents(data as EventType[]);
    };

    fetchEvents();
  }, [events]); // ✅ Refresh calendar when events change


  // Handle clicking on a day to view/add events
  const handleDateClick = (info: { dateStr: string }) => {
    if (!isEditable) return; // ✅ Prevent adding events in read-only mode

    //setSelectedDay(info.dateStr);

    // Pre-fill event start time with selected date & current time
    const currentTime = new Date();
    const formattedTime = currentTime.toTimeString().split(":").slice(0, 2).join(":"); // ✅ Only HH:MM
    const prefilledDateTime = `${info.dateStr}T${formattedTime}`;

    setNewEventDate(prefilledDateTime);
    setNewEventEnd(prefilledDateTime); // Default end same as start (can be changed)

    setShowAddEvent(true);
  };



  const isFormValid = newEventTitle.trim() !== "" && newEventDate.trim() !== "" && newEventEnd.trim() !== "";


  const handleAddEvent = async () => {
    if (!newEventTitle || !newEventDate || !newEventEnd) return;

    const startDate = new Date(newEventDate);
    const endDate = new Date(newEventEnd);

    const startUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString();
    const endUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString();

    const { data, error } = await supabase
      .from("events")
      .insert([{
        title: newEventTitle,
        start: startUTC,  // ✅ Stored as UTC
        end: endUTC,
        location: newEventLocation,
        details: newEventDetails
      }])
      .select();

    if (error) {
      console.error("Error adding event:", error);
    } else {
      setEvents([...events, ...data]);
      setNewEventTitle("");
      setNewEventEnd("");
      setNewEventLocation("");
      setNewEventDetails("");
      setShowAddEvent(false);
    }
  };

  // Handle event click (for deleting/viewing details)
  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start ? new Date(info.event.start as unknown as string).toLocaleString() : "N/A", // ✅ Fix conversion
      end: info.event.end ? new Date(info.event.end as unknown as string).toLocaleString() : "N/A",
      location: info.event.extendedProps.location as string | undefined,
      details: info.event.extendedProps.details as string | undefined,
    });
  };

  // Delete event and refresh the calendar
  const deleteEvent = async () => {
    if (!selectedEvent) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", selectedEvent.id);

    if (error) {
      console.error("Error deleting event:", error);
    } else {
      setEvents(events.filter((event) => event.id !== selectedEvent.id)); // ✅ Remove from state
      setSelectedEvent(null);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h1 className="calendar-title">Blue Dots Event Calendar</h1>

      <div style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
        <button className="toggle-view-button" onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}>
          {viewMode === "calendar" ? "Switch to List View" : "Switch to Calendar View"}
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
        .map((event) => (
          <li key={event.id} className="event-list-item">
            <strong>{event.title}</strong><br />
            📅 {new Date(event.start).toLocaleDateString()}  
            ⏰ {new Date(event.start).toLocaleTimeString()} - 
            {event.end ? new Date(event.end).toLocaleTimeString() : "N/A"}
            {event.location && <div>📍 {event.location}</div>}
            {event.details && <div>📝 {event.details}</div>}
          </li>
        ))}
    </ul>
    
    {events.filter((event) => new Date(event.start) >= new Date()).length === 0 && (
      <p>No upcoming events.</p> // ✅ Show message if no upcoming events exist
    )}
  </div>
) : (
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
    dateClick={isEditable ? handleDateClick : undefined}
    eventClick={handleEventClick}
    editable={isEditable}
  />
)}




      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New Event</h3>

            <label>Event Title <span className="required">*</span></label>
            <input type="text" placeholder="Event Title" className={`modal-input ${!newEventTitle && "invalid"}`}
              value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)}
            />

            <label>Start Time <span className="required">*</span></label>
            <input type="datetime-local" className={`modal-input ${!newEventDate && "invalid"}`}
              value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)}
              step="60" // ✅ Ensures only HH:MM is used (no seconds)
            />

            <label>End Time <span className="required">*</span></label>
            <input type="datetime-local" className={`modal-input ${!newEventEnd && "invalid"}`}
              value={newEventEnd} onChange={(e) => setNewEventEnd(e.target.value)}
              step="60" // ✅ Ensures only HH:MM is used (no seconds)
            />

            <label>Location</label>
            <input type="text" placeholder="Location" className="modal-input"
              value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)}
            />

            <label>Details</label>
            <textarea placeholder="Event Details (Links Allowed)" className="modal-input"
              value={newEventDetails} onChange={(e) => setNewEventDetails(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="modal-button" onClick={handleAddEvent} disabled={!isFormValid}>
                Save
              </button>
              <button className="modal-button close" onClick={() => setShowAddEvent(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
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
              {isEditable && (
                <button onClick={deleteEvent} className="modal-button delete">Delete Event</button>
              )}
              <button onClick={() => setSelectedEvent(null)} className="modal-button close">Close</button>
            </div>
          </div>
        </div>
      )}



      {/* Secure Login Modal */}
      {/* {showLogin && (
  <div className="modal-overlay">
    <div className="modal">
      <h3 className="modal-title">Enter Password</h3>
      <input 
        type="password"
        placeholder="Enter password"
        className="modal-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="modal-button" onClick={handleLogin}>
          Submit
        </button>
        <button className="modal-button close" onClick={() => setShowLogin(false)}>Cancel</button>
      </div>
    </div>
  </div>
)} */}
    </div>
  );
};

export default EventCalendar;
