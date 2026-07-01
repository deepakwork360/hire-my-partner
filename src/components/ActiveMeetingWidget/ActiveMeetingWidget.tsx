"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Plus,
  Navigation,
  Activity,
  X,
  CheckCircle2,
  Map,
  Compass,
  Calendar,
  TrendingUp,
  User,
  Shield,
  Smartphone,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/toastStore";
import { partners } from "@/modules/partner/data/partners";
import { useAuthStore } from "@/modules/auth/store";

interface BookingData {
  id: number | string;
  image: string;
  name: string;
  age: number;
  location: string;
  rating: string | number;
  date: string;
  time: string;
  price: string;
  status: "Pending" | "Confirmed" | "Completed" | "Declined";
  bio?: string;
  reason?: string;
}

// ── Time & Date Parsers ──────────────────────────────────────────────────────

function parseBookingEndDateTime(dateStr: string, timeRangeStr: string): Date | null {
  try {
    const start = parseBookingStartDateTime(dateStr, timeRangeStr);
    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const endTimeStr = parts.length === 2 ? parts[1].trim() : parts[0].trim();
    
    let targetDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      targetDateStr = dateStr.split(" - ")[1].trim();
    }
    
    let year = 0, month = 0, day = 0;
    if (targetDateStr.includes("-")) {
      const dParts = targetDateStr.split("-");
      year = parseInt(dParts[0], 10);
      month = parseInt(dParts[1], 10) - 1;
      day = parseInt(dParts[2], 10);
    } else {
      const parsedDate = new Date(targetDateStr);
      if (isNaN(parsedDate.getTime())) return null;
      year = parsedDate.getFullYear();
      month = parsedDate.getMonth();
      day = parsedDate.getDate();
    }

    const timeMatch = endTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)/i);
    let res: Date | null = null;
    if (!timeMatch) {
      const timeMatch24 = endTimeStr.match(/(\d+)[:.](\d+)/);
      if (timeMatch24) {
        const hours = parseInt(timeMatch24[1], 10);
        const minutes = parseInt(timeMatch24[2], 10);
        res = new Date(year, month, day, hours, minutes, 0, 0);
      }
    } else {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      res = new Date(year, month, day, hours, minutes, 0, 0);
    }

    if (res && !isNaN(res.getTime())) {
      if (start && res.getTime() < start.getTime()) {
        res.setDate(res.getDate() + 1);
      }
      return res;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function parseBookingStartDateTime(dateStr: string, timeRangeStr: string): Date | null {
  try {
    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const startTimeStr = parts[0].trim();
    
    let targetDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      targetDateStr = dateStr.split(" - ")[0].trim();
    }
    
    let year = 0, month = 0, day = 0;
    if (targetDateStr.includes("-")) {
      const dParts = targetDateStr.split("-");
      year = parseInt(dParts[0], 10);
      month = parseInt(dParts[1], 10) - 1;
      day = parseInt(dParts[2], 10);
    } else {
      const parsedDate = new Date(targetDateStr);
      if (isNaN(parsedDate.getTime())) return null;
      year = parsedDate.getFullYear();
      month = parsedDate.getMonth();
      day = parsedDate.getDate();
    }
    
    const timeMatch = startTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      const timeMatch24 = startTimeStr.match(/(\d+)[:.](\d+)/);
      if (timeMatch24) {
        const hours = parseInt(timeMatch24[1], 10);
        const minutes = parseInt(timeMatch24[2], 10);
        const res = new Date(year, month, day, hours, minutes, 0, 0);
        return isNaN(res.getTime()) ? null : res;
      }
      return null;
    }
    
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    const res = new Date(year, month, day, hours, minutes, 0, 0);
    return isNaN(res.getTime()) ? null : res;
  } catch (e) {
    return null;
  }
}

// Extend a time range (e.g. "07:00 PM - 09:00 PM" + 1 hour -> "07:00 PM - 10:00 PM")
function extendTimeRange(timeRangeStr: string, hoursToAdd: number): string {
  try {
    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    if (parts.length !== 2) return timeRangeStr;
    const startTimeStr = parts[0].trim();
    const endTimeStr = parts[1].trim();
    
    // Parse end time hours and minutes
    const endMatch = endTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)?/i);
    if (!endMatch) return timeRangeStr;
    
    let endHour = parseInt(endMatch[1], 10);
    const endMinute = parseInt(endMatch[2], 10);
    let endAmpm = endMatch[3] ? endMatch[3].toUpperCase() : null;
    
    // If end time has no AM/PM, check if start time has one
    if (!endAmpm) {
      const startMatch = startTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)/i);
      if (startMatch) {
        endAmpm = startMatch[3].toUpperCase();
      }
    }
    
    // Convert to 24-hour clock minutes
    let totalMinutes = 0;
    if (endAmpm) {
      let h24 = endHour;
      if (endAmpm === "PM" && h24 < 12) h24 += 12;
      if (endAmpm === "AM" && h24 === 12) h24 = 0;
      totalMinutes = h24 * 60 + endMinute;
    } else {
      totalMinutes = endHour * 60 + endMinute;
    }
    
    // Add extension minutes
    const addedMins = Math.round(hoursToAdd * 60);
    const newTotalMinutes = (totalMinutes + addedMins) % (24 * 60);
    
    let newHour24 = Math.floor(newTotalMinutes / 60);
    const newMinute = newTotalMinutes % 60;
    
    let newEndTimeStr = "";
    if (endAmpm) {
      // Format as 12-hour AM/PM
      const newAmpm = newHour24 >= 12 ? "PM" : "AM";
      let newHour12 = newHour24 % 12;
      newHour12 = newHour12 ? newHour12 : 12;
      newEndTimeStr = `${String(newHour12).padStart(2, "0")}:${String(newMinute).padStart(2, "0")} ${newAmpm}`;
    } else {
      // Format as 24-hour or simple HH:MM
      newEndTimeStr = `${String(newHour24).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
    }
    
    return `${startTimeStr} - ${newEndTimeStr}`;
  } catch (e) {
    return timeRangeStr;
  }
}

// Extends a booking time and returns the updated { date: string, time: string }
function extendBookingDateTime(
  dateStr: string,
  timeRangeStr: string,
  hoursToAdd: number
): { date: string; time: string } {
  try {
    const start = parseBookingStartDateTime(dateStr, timeRangeStr);
    const end = parseBookingEndDateTime(dateStr, timeRangeStr);
    if (!start || !end) return { date: dateStr, time: timeRangeStr };

    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const startTimeStr = parts[0].trim();
    const endTimeStr = parts[1].trim();

    // Check if AM/PM was used in the original end time
    const useAmpm = /[a-z]/i.test(endTimeStr);

    // Calculate new end date by adding hours
    const addedMs = Math.round(hoursToAdd * 60 * 60 * 1000);
    const newEnd = new Date(end.getTime() + addedMs);

    // Format new time string
    const hours = newEnd.getHours();
    const minutes = newEnd.getMinutes();
    let newEndTimeStr = "";
    if (useAmpm) {
      const ampm = hours >= 12 ? "PM" : "AM";
      let h12 = hours % 12;
      h12 = h12 ? h12 : 12;
      newEndTimeStr = `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
    } else {
      newEndTimeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    const newTime = `${startTimeStr} - ${newEndTimeStr}`;

    // Get the start base date string
    let startDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      startDateStr = dateStr.split(" - ")[0].trim();
    }

    // Format start and end date strings to compare
    const formatSingleDate = (d: Date, template: string) => {
      if (template.includes("-")) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }
      return d.toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formattedStart = formatSingleDate(start, startDateStr);
    const formattedEnd = formatSingleDate(newEnd, startDateStr);

    let newDate = startDateStr;
    if (formattedStart !== formattedEnd) {
      newDate = `${formattedStart} - ${formattedEnd}`;
    } else {
      newDate = formattedStart;
    }

    return { date: newDate, time: newTime };
  } catch (e) {
    return { date: dateStr, time: timeRangeStr };
  }
}

// ── Companion Lookup ────────────────────────────────────────────────────────

const findPartnerByNameOrId = (nameOrId: string | number): any => {
  if (!nameOrId) return null;
  const target = String(nameOrId).toLowerCase();

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("approved_partners");
      if (saved) {
        const localList: any[] = JSON.parse(saved);
        const found = localList.find((p) => 
          String(p.id).toLowerCase() === target ||
          p.name.toLowerCase() === target
        );
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return partners.find((p) => 
    String(p.id).toLowerCase() === target ||
    p.name.toLowerCase() === target
  ) || null;
};

// ── Component ───────────────────────────────────────────────────────────────

export default function ActiveMeetingWidget() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeBooking, setActiveBooking] = useState<BookingData | null>(null);
  const [isCurrentUserPartner, setIsCurrentUserPartner] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"status" | "tracking" | "extend">("status");
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const [extendHours, setExtendHours] = useState<number>(1);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [companionProgress, setCompanionProgress] = useState<number>(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 }); // Default: Mumbai
  const [hasRealLocation, setHasRealLocation] = useState<boolean>(false);

  // Load extensions to calculate cumulative extended hours
  const extensionKey = activeBooking ? `booking_extensions_${activeBooking.id}` : "";
  let totalExtended = 0;
  if (typeof window !== "undefined" && extensionKey) {
    try {
      const savedExts = localStorage.getItem(extensionKey);
      if (savedExts) {
        const extensionList = JSON.parse(savedExts);
        totalExtended = extensionList.reduce((sum: number, ext: any) => sum + ext.hours, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const maxAllowedExtension = Math.max(0, 24 - totalExtended);

  useEffect(() => {
    if (extendHours > maxAllowedExtension && maxAllowedExtension > 0) {
      setExtendHours(maxAllowedExtension);
    }
  }, [maxAllowedExtension]);

  // Poll for coordinates
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setHasRealLocation(true);
        },
        () => {
          // Fallback to location helper
          try {
            const saved = localStorage.getItem("user_active_location");
            if (saved) {
              const loc = JSON.parse(saved);
              setUserCoords({ lat: loc.lat, lng: loc.lng });
            }
          } catch (e) {}
        }
      );
    }
  }, []);

  // 1. Periodically check bookings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkActiveBooking = () => {
      try {
        // 1. Client Bookings
        const localBookings = localStorage.getItem("hire_my_partner_bookings") || "[]";
        let bookings: BookingData[] = JSON.parse(localBookings);
        
        let bookingsChanged = false;
        bookings = bookings.map((b) => {
          if (b.status === "Pending") {
            const startDate = parseBookingStartDateTime(b.date, b.time);
            if (startDate && startDate.getTime() < Date.now()) {
              bookingsChanged = true;
              return { ...b, status: "Declined" as const };
            }
          }
          return b;
        });

        if (bookingsChanged) {
          localStorage.setItem("hire_my_partner_bookings", JSON.stringify(bookings));
          window.dispatchEvent(new Event("bookings_updated"));
        }

        bookings.forEach((b) => {
          if (b.status !== "Confirmed") {
            localStorage.removeItem(`booking_extensions_${b.id}`);
            sessionStorage.removeItem(`triggered_milestones_${b.id}`);
            sessionStorage.removeItem(`triggered_end_milestones_${b.id}`);
            sessionStorage.removeItem(`widget_minimized_${b.id}`);
          }
        });

        // 2. Partner Requests
        const localRequests = localStorage.getItem("hire_my_partner_requests") || "[]";
        let requests: BookingData[] = JSON.parse(localRequests);
        
        let requestsChanged = false;
        requests = requests.map((r) => {
          if (r.status === "Pending") {
            const startDate = parseBookingStartDateTime(r.date, r.time);
            if (startDate && startDate.getTime() < Date.now()) {
              requestsChanged = true;
              return { ...r, status: "Declined" as const };
            }
          }
          return r;
        });

        if (requestsChanged) {
          localStorage.setItem("hire_my_partner_requests", JSON.stringify(requests));
          window.dispatchEvent(new Event("bookings_updated"));
        }

        requests.forEach((b) => {
          if (b.status !== "Confirmed") {
            localStorage.removeItem(`booking_extensions_${b.id}`);
            sessionStorage.removeItem(`triggered_milestones_${b.id}`);
            sessionStorage.removeItem(`triggered_end_milestones_${b.id}`);
            sessionStorage.removeItem(`widget_minimized_${b.id}`);
          }
        });

        const now = Date.now();
        let foundActive: BookingData | null = null;
        let isPartner = false;

        // Check client bookings first
        const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
        for (const b of confirmedBookings) {
          let start = parseBookingStartDateTime(b.date, b.time);
          let end = parseBookingEndDateTime(b.date, b.time);
          
          if (start && end) {
            const durationMs = end.getTime() - start.getTime();
            const durationMins = durationMs / (60 * 1000);
            const isTestSession = durationMins <= 5;
            
            const startsInMs = start.getTime() - now;
            const startsInMins = startsInMs / (60 * 1000);
            
            if (isTestSession && (startsInMins > 20.2 || startsInMins < -5)) {
              const newStart = new Date(Date.now() + 10 * 1000);
              const newEnd = new Date(newStart.getTime() + durationMs);
              
              const formatTimeStr = (d: Date) => {
                let hrs = d.getHours();
                const mins = d.getMinutes();
                const ampm = hrs >= 12 ? "PM" : "AM";
                hrs = hrs % 12;
                hrs = hrs ? hrs : 12;
                return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
              };
              
              const formatYearMonthDay = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };

              b.date = formatYearMonthDay(newStart);
              b.time = `${formatTimeStr(newStart)} - ${formatTimeStr(newEnd)}`;
              
              const updatedBookings = bookings.map((item) => {
                if (String(item.id) === String(b.id)) {
                  return { ...item, date: b.date, time: b.time };
                }
                return item;
              });
              localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updatedBookings));
              window.dispatchEvent(new Event("bookings_updated"));
              
              start = newStart;
              end = newEnd;
            }

            const isUpcoming = (start.getTime() - now) > 0;
            const isRunning = start.getTime() <= now && now < end.getTime();
            
            if (isUpcoming || isRunning) {
              foundActive = b;
              isPartner = false;
              break;
            }
            
            // Auto-complete if meeting has naturally ended
            if (now >= end.getTime()) {
              const updated = bookings.map((item) => {
                if (String(item.id) === String(b.id)) {
                  return { ...item, status: "Completed" as const };
                }
                return item;
              });
              localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updated));
              window.dispatchEvent(new Event("bookings_updated"));
              toast.success(`Meeting with ${b.name} has ended successfully.`);
            }
          }
        }

        // If no client booking is active, check partner requests
        if (!foundActive) {
          const confirmedRequests = requests.filter((b) => b.status === "Confirmed");
          for (const b of confirmedRequests) {
            let start = parseBookingStartDateTime(b.date, b.time);
            let end = parseBookingEndDateTime(b.date, b.time);
            
            if (start && end) {
              const durationMs = end.getTime() - start.getTime();
              const durationMins = durationMs / (60 * 1000);
              const isTestSession = durationMins <= 5;
              
              const startsInMs = start.getTime() - now;
              const startsInMins = startsInMs / (60 * 1000);
              
              if (isTestSession && (startsInMins > 20.2 || startsInMins < -5)) {
                const newStart = new Date(Date.now() + 10 * 1000);
                const newEnd = new Date(newStart.getTime() + durationMs);
                
                const formatTimeStr = (d: Date) => {
                  let hrs = d.getHours();
                  const mins = d.getMinutes();
                  const ampm = hrs >= 12 ? "PM" : "AM";
                  hrs = hrs % 12;
                  hrs = hrs ? hrs : 12;
                  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
                };
                
                const formatYearMonthDay = (d: Date) => {
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  return `${y}-${m}-${day}`;
                };

                b.date = formatYearMonthDay(newStart);
                b.time = `${formatTimeStr(newStart)} - ${formatTimeStr(newEnd)}`;
                
                const updatedRequests = requests.map((item) => {
                  if (String(item.id) === String(b.id)) {
                    return { ...item, date: b.date, time: b.time };
                  }
                  return item;
                });
                localStorage.setItem("hire_my_partner_requests", JSON.stringify(updatedRequests));
                window.dispatchEvent(new Event("bookings_updated"));
                
                start = newStart;
                end = newEnd;
              }

              const isUpcoming = (start.getTime() - now) > 0;
              const isRunning = start.getTime() <= now && now < end.getTime();
              
              if (isUpcoming || isRunning) {
                foundActive = b;
                isPartner = true;
                break;
              }
              
              // Auto-complete if meeting has naturally ended
              if (now >= end.getTime()) {
                const updated = requests.map((item) => {
                  if (String(item.id) === String(b.id)) {
                    return { ...item, status: "Completed" as const };
                  }
                  return item;
                });
                localStorage.setItem("hire_my_partner_requests", JSON.stringify(updated));
                window.dispatchEvent(new Event("bookings_updated"));
                toast.success(`Meeting request with ${b.name} has ended successfully.`);
              }
            }
          }
        }

        setActiveBooking(foundActive);
        setIsCurrentUserPartner(isPartner);
      } catch (e) {
        console.error("Failed to check active bookings", e);
      }
    };

    checkActiveBooking();

    const handleUpdateEvent = () => {
      checkActiveBooking();
    };
    window.addEventListener("bookings_updated", handleUpdateEvent);

    const interval = setInterval(() => {
      setNowTime(Date.now());
      checkActiveBooking();
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("bookings_updated", handleUpdateEvent);
    };
  }, []);

  // 2. Alarm/Milestone Trigger & Auto-Maximize Logic
  useEffect(() => {
    if (!activeBooking) return;
    
    const start = parseBookingStartDateTime(activeBooking.date, activeBooking.time);
    const end = parseBookingEndDateTime(activeBooking.date, activeBooking.time);
    if (!start) return;

    const remainingMins = Math.ceil((start.getTime() - Date.now()) / (60 * 1000));
    const remainingEndMins = end ? Math.ceil((end.getTime() - Date.now()) / (60 * 1000)) : -1;
    
    // Check milestones: 20, 15, 5 minutes before START
    const milestoneKey = `triggered_milestones_${activeBooking.id}`;
    let triggered: string[] = [];
    try {
      const saved = sessionStorage.getItem(milestoneKey);
      if (saved) triggered = JSON.parse(saved);
    } catch (e) {}

    const checkAndTrigger = (mins: number) => {
      const tag = String(mins);
      if (remainingMins === mins && !triggered.includes(tag)) {
        triggered.push(tag);
        sessionStorage.setItem(milestoneKey, JSON.stringify(triggered));
        setIsMinimized(false); // Pop up automatically!
        toast.info(`Reminder: Your meeting with ${activeBooking.name} starts in ${mins} minutes!`);
        
        // Dynamic sound/vibration trigger
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    };

    // Check milestones: 20, 15, 5 minutes before END
    const endMilestoneKey = `triggered_end_milestones_${activeBooking.id}`;
    let endTriggered: string[] = [];
    try {
      const savedEnd = sessionStorage.getItem(endMilestoneKey);
      if (savedEnd) endTriggered = JSON.parse(savedEnd);
    } catch (e) {}

    const checkAndTriggerEnd = (mins: number) => {
      const tag = String(mins);
      if (remainingEndMins === mins && !endTriggered.includes(tag)) {
        endTriggered.push(tag);
        sessionStorage.setItem(endMilestoneKey, JSON.stringify(endTriggered));
        setIsMinimized(false); // Pop up automatically!
        setActiveTab("extend"); // Focus on the Extend tab
        toast.info(`Time Reminder: Your meeting with ${activeBooking.name} ends in ${mins} minutes! Extend duration to keep the session running.`);
        
        // Dynamic sound/vibration trigger
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    };

    // Trigger exact minutes checks for start
    if (remainingMins === 20) checkAndTrigger(20);
    if (remainingMins === 15) checkAndTrigger(15);
    if (remainingMins === 5) checkAndTrigger(5);

    // Trigger exact minutes checks for end
    if (remainingMins <= 0 && remainingEndMins > 0) {
      if (remainingEndMins === 20) checkAndTriggerEnd(20);
      if (remainingEndMins === 15) checkAndTriggerEnd(15);
      if (remainingEndMins === 5) checkAndTriggerEnd(5);
    }

    // Companion transit progress simulation
    if (remainingMins > 0 && remainingMins <= 20) {
      // Scale progress from 0% (at 20 mins) to 100% (at 0 mins)
      const progress = ((20 - remainingMins) / 20) * 100;
      setCompanionProgress(Math.min(100, Math.max(0, progress)));
    } else if (remainingMins <= 0) {
      setCompanionProgress(100);
    }

  }, [activeBooking, nowTime]);

  // Keep track of minimized preference for this specific active booking
  useEffect(() => {
    if (activeBooking) {
      const pref = sessionStorage.getItem(`widget_minimized_${activeBooking.id}`);
      if (pref !== null) {
        setIsMinimized(pref === "true");
      } else {
        setIsMinimized(false); // default maximize on initial load
      }
    }
  }, [activeBooking?.id]);

  const handleToggleMinimize = () => {
    if (!activeBooking) return;
    const newState = !isMinimized;
    setIsMinimized(newState);
    sessionStorage.setItem(`widget_minimized_${activeBooking.id}`, String(newState));
  };

  if (!activeBooking) return null;

  const start = parseBookingStartDateTime(activeBooking.date, activeBooking.time);
  const end = parseBookingEndDateTime(activeBooking.date, activeBooking.time);
  if (!start || !end) return null;

  const startsInMs = start.getTime() - nowTime;
  const endsInMs = end.getTime() - nowTime;
  const isMeetingRunning = startsInMs <= 0;

  // Format remaining time string
  const getTimerString = () => {
    if (startsInMs > 0) {
      const mins = Math.floor(startsInMs / 60000);
      const secs = Math.floor((startsInMs % 60000) / 1000);
      return `Starts in ${mins}m ${secs}s`;
    } else {
      const hours = Math.floor(endsInMs / 3600000);
      const mins = Math.floor((endsInMs % 3600000) / 60000);
      const secs = Math.floor((endsInMs % 60000) / 1000);
      if (hours > 0) {
        return `${hours}h ${mins}m ${secs}s remaining`;
      }
      return `${mins}m ${secs}s remaining`;
    }
  };

  const pDetails = findPartnerByNameOrId(activeBooking.name);
  const companionHourlyRate = pDetails?.pricing?.oneHour || 2500;

  const handleRequestExtension = () => {
    if (extendHours > maxAllowedExtension) {
      toast.error("Extension limit reached.");
      return;
    }
    setIsExtending(true);
    const extPrice = extendHours * companionHourlyRate;
    
    try {
      const localBookings = localStorage.getItem("hire_my_partner_bookings");
      if (localBookings) {
        const bookingsList: BookingData[] = JSON.parse(localBookings);
        let isTest = false;
        const updatedList = bookingsList.map((b) => {
          if (String(b.id) === String(activeBooking.id)) {
            const start = parseBookingStartDateTime(b.date, b.time);
            const end = parseBookingEndDateTime(b.date, b.time);
            if (start && end) {
              const durMins = (end.getTime() - start.getTime()) / (60 * 1000);
              isTest = durMins <= 5;
            }

            const unitsToAdd = isTest ? extendHours / 60 : extendHours;
            const { date: newDate, time: newTime } = extendBookingDateTime(b.date, b.time, unitsToAdd);
            const rawPaid = parseInt(b.price.replace(/[^\d]/g, ""), 10) || 0;
            const newPrice = `₹${(rawPaid + extPrice).toLocaleString("en-IN")}`;
            return {
              ...b,
              time: newTime,
              date: newDate,
              price: newPrice
            };
          }
          return b;
        });

        localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updatedList));
        window.dispatchEvent(new Event("bookings_updated"));

        // Save mock invoice extension
        const extensionKey = `booking_extensions_${activeBooking.id}`;
        const savedExts = localStorage.getItem(extensionKey);
        const extensionList = savedExts ? JSON.parse(savedExts) : [];
        const newExt = {
          id: `EXT-${Date.now()}`,
          hours: extendHours,
          amount: extPrice,
          status: "Approved",
          date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })
        };
        localStorage.setItem(extensionKey, JSON.stringify([...extensionList, newExt]));

        // Refresh UI state
        const updatedActive = updatedList.find(b => String(b.id) === String(activeBooking.id));
        if (updatedActive) setActiveBooking(updatedActive);

        toast.success(isTest ? `Meeting extended by +${extendHours} minute(s) successfully!` : `Meeting extended by +${extendHours} hour(s) successfully!`);
      }
    } catch (e) {
      toast.error("Failed to extend meeting.");
      console.error(e);
    }
    
    setIsExtending(false);
  };

  // Coordinates for the simulated companion movement:
  // User at (200, 120), Companion moving from (50, 40) at start of transit towards User
  const progressRatio = companionProgress / 100;
  const companionX = 50 + (200 - 50) * progressRatio;
  const companionY = 40 + (120 - 40) * progressRatio;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:bottom-auto md:top-24 z-[9999] flex justify-end md:block font-sans">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // ── MINIMIZED SIDE-SCREEN DOCK ──────────────────────────────────────
          <motion.button
            key="minimized"
            layoutId="active-meeting-container"
            onClick={handleToggleMinimize}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-950/90 border border-primary/40 backdrop-blur-xl shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] cursor-pointer text-white text-xs font-black uppercase tracking-wider relative overflow-hidden group shrink-0"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-accent/15 to-primary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse relative z-10 shrink-0" />
            
            <div className="flex flex-col text-left relative z-10">
              <span className="text-[9px] font-black text-primary tracking-widest leading-tight">Meeting with {activeBooking.name}</span>
              <span className="text-white/80 font-bold mt-0.5 tracking-wide lowercase first-letter:uppercase">{getTimerString()}</span>
            </div>
            
            <Maximize2 size={13} className="text-text-muted group-hover:text-white transition-colors ml-2 relative z-10" />
          </motion.button>
        ) : (
          // ── MAXIMIZED FLOATING PANEL ───────────────────────────────────────
          <motion.div
            key="maximized"
            layoutId="active-meeting-container"
            className="w-full md:w-[400px] bg-slate-950/95 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex flex-col text-text-main relative"
          >
            {/* Background gradient decorative glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Panel Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={activeBooking.image}
                    alt={activeBooking.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary block">
                    {isMeetingRunning ? "Meeting Active" : "Upcoming Session"}
                  </span>
                  <h4 className="text-sm font-black text-white leading-none mt-1" style={{ color: '#ffffff' }}>
                    {activeBooking.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMinimize}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all cursor-pointer"
                  title="Minimize to side-screen"
                >
                  <Minimize2 size={13} />
                </button>
              </div>
            </div>

            {/* Countdown Banner */}
            <div className="px-5 py-3.5 bg-primary/10 border-b border-white/5 flex items-center justify-between text-xs font-bold z-10">
              <span className="flex items-center gap-1.5 text-primary text-[10px] uppercase tracking-wider">
                <Clock size={12} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
                Time Duration
              </span>
              <span className="text-white tracking-wide font-black">
                {getTimerString()}
              </span>
            </div>

            {/* Tab Swapper */}
            <div className="flex border-b border-white/5 p-1 bg-white/[0.01] z-10">
              {[
                { id: "status", label: "Overview", icon: Clock },
                { id: "tracking", label: "GPS Map", icon: Map },
                { id: "extend", label: isCurrentUserPartner ? "Extensions" : "Extend Time", icon: Plus },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      active
                        ? "bg-white/10 border border-white/10 text-white font-black"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content area */}
            <div className="p-5 min-h-[220px] flex flex-col justify-between relative z-10">
              {activeTab === "status" && (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Schedule Date</p>
                      <p className="text-xs font-bold text-white mt-0.5">{activeBooking.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Time Slot</p>
                      <p className="text-xs font-bold text-white mt-0.5">{activeBooking.time}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 mt-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <p className="text-[10px] font-semibold text-text-muted leading-relaxed">
                      {isMeetingRunning
                        ? "Session is currently in progress. Tap 'GPS Map' to locate your companion."
                        : `Your meeting will start in ${Math.ceil(startsInMs / 60000)} minutes.`}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "tracking" && (
                <div className="space-y-3.5">
                  {/* Stylized Vector Map */}
                  <div className="relative w-full h-[150px] bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
                    {/* Map Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
                    
                    <svg className="w-full h-full p-2" viewBox="0 0 250 150">
                      {/* Dotted Route Line */}
                      <path
                        d="M 50 40 Q 120 20 120 80 T 200 120"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="4"
                      />
                      
                      {/* Animated path progress */}
                      <path
                        d="M 50 40 Q 120 20 120 80 T 200 120"
                        fill="none"
                        stroke="rgb(var(--primary-rgb))"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="4"
                        strokeDashoffset={100 - companionProgress}
                        className="stroke-primary"
                      />

                      {/* Client Marker (Destination) */}
                      <g transform="translate(200, 120)">
                        <circle r="8" fill="#10b981" className="opacity-30 animate-ping" />
                        <circle r="5" fill="#10b981" />
                        <text y="-8" textAnchor="middle" fill="#10b981" fontSize="6" fontWeight="bold">YOU</text>
                      </g>

                      {/* Companion Marker */}
                      <g transform={`translate(${companionX}, ${companionY})`}>
                        <circle r="8" fill="rgb(var(--primary-rgb))" className="opacity-40 animate-ping" />
                        <circle r="5" fill="rgb(var(--primary-rgb))" />
                        <text y="-8" textAnchor="middle" fill="rgb(var(--primary-rgb))" fontSize="6" fontWeight="black" className="fill-primary">
                          {activeBooking.name.split(" ")[0].toUpperCase()}
                        </text>
                      </g>
                    </svg>

                    {/* Badge */}
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[8px] font-black tracking-widest text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      GPS SHARING LIVE
                    </div>
                  </div>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-[7.5px] font-black uppercase text-text-muted tracking-wider block">Remaining</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5">
                        {isMeetingRunning ? "0.0 KM" : `${(2.4 * (1 - progressRatio) + 0.1).toFixed(1)} KM`}
                      </span>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-[7.5px] font-black uppercase text-text-muted tracking-wider block">ETA</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5">
                        {isMeetingRunning ? "Arrived" : `${Math.ceil(startsInMs / 60000)} Mins`}
                      </span>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-[7.5px] font-black uppercase text-text-muted tracking-wider block">Speed</span>
                      <span className="text-[10px] font-bold text-white block mt-0.5 flex items-center justify-center gap-1">
                        <Activity size={10} className="text-primary animate-pulse" />
                        {isMeetingRunning ? "0 km/h" : `${Math.floor(22 + Math.random() * 8)} km/h`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "extend" && (() => {
                const bId = activeBooking!.id;
                const bDate = activeBooking!.date;
                const bTime = activeBooking!.time;
                const start = parseBookingStartDateTime(bDate, bTime);
                const end = parseBookingEndDateTime(bDate, bTime);
                const isTestSession = (start && end) ? (end.getTime() - start.getTime()) / (60 * 1000) <= 5 : false;
                return (
                  <div className="space-y-4">
                    {isCurrentUserPartner ? (
                      // Partner View: Information only, no extend button or stepper
                      <div className="space-y-3.5">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[10px] font-bold text-text-muted leading-relaxed">
                            Only the client can request to extend this meeting session. You will be notified automatically if they add more time.
                          </p>
                        </div>
                        
                        {totalExtended > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Extended Duration Details</p>
                            <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                              {JSON.parse(localStorage.getItem(`booking_extensions_${bId}`) || "[]").map((ext: any, idx: number) => {
                                return (
                                  <div key={idx} className="flex justify-between items-center text-[10px] bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                                    <span className="text-white font-bold">+{ext.hours} {isTestSession ? "Min(s)" : "Hr(s)"}</span>
                                    <span className="text-primary font-black">₹{ext.amount.toLocaleString("en-IN")}</span>
                                  </div>
                                );
                              })}
                              <div className="flex justify-between items-center text-[10px] bg-primary/10 border border-primary/20 px-3 py-2 rounded-xl mt-1">
                                <span className="text-primary font-black">Total Extended:</span>
                                <span className="text-white font-black">{totalExtended} {isTestSession ? "Min(s)" : "Hr(s)"}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center italic text-[10px] text-text-muted">
                            No extensions applied to this session yet.
                          </div>
                        )}
                      </div>
                    ) : (
                      // Client View: Stepper and Action Button
                      <>
                        {maxAllowedExtension <= 0 ? (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                            <p className="text-[10px] font-bold text-red-400 leading-relaxed">
                              You have reached the maximum extension limit of 24 hours/minutes for this session.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                              <p className="text-[10px] font-bold text-text-muted leading-relaxed">
                                Need more time with your companion? Extend the session duration instantly. Hourly rate: <span className="text-primary font-black">₹{companionHourlyRate.toLocaleString("en-IN")}/hr</span>.
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Stepper */}
                              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setExtendHours(h => Math.max(1, h - 1))}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-colors"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black px-3.5 text-white">{extendHours} Hr</span>
                                <button
                                  type="button"
                                  onClick={() => setExtendHours(h => Math.min(maxAllowedExtension, h + 1))}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-colors"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                disabled={isExtending}
                                onClick={handleRequestExtension}
                                className="flex-1 h-9 rounded-xl bg-linear-to-r from-primary to-accent hover:brightness-110 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
                              >
                                <Plus size={12} />
                                Extend (₹{(extendHours * companionHourlyRate).toLocaleString("en-IN")})
                              </button>
                            </div>

                            {/* Client also sees the extension logs if any exist */}
                            {totalExtended > 0 && (
                              <div className="space-y-1.5 mt-2">
                                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Previous Extensions</p>
                                <div className="flex justify-between items-center text-[9px] bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
                                  <span className="text-primary font-black">Total Added:</span>
                                  <span className="text-white font-black">{totalExtended} {isTestSession ? "Min(s)" : "Hr(s)"}</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Bottom Actions footer */}
            <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-text-muted z-10">
              <span className="flex items-center gap-1">
                <Shield size={10} className="text-emerald-500" />
                SECURE MEETING
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
