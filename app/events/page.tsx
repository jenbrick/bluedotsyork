"use client";

import { useState } from "react";
import EventCalendar from "@/app/components/EventCalendar";
import Breadcrumb from "../components/Breadcrumb";

import "./events.css";

export default function Home() {
//  const { isAuthenticated } = useAuth(); 
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
   {/* Breadcrumb Navigation */}
<Breadcrumb />
      <EventCalendar isEditable={isEditable} /> {/* ✅ Pass isEditable */}
    </div>
  );
}
