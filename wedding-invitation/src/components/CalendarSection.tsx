"use client";

import { useState } from "react";

const year = 2026;
const month = 10; // نوفمبر، لأن JavaScript يبدأ الشهور من 0
const selectedDay = 10;

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getCalendarDays() {
  const firstDay = new Date(year, month, 1).getDay();

  // جعل بداية الأسبوع يوم الاثنين
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<number | null> = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

export default function CalendarSection() {
  const [added, setAdded] = useState(false);

  const calendarDays = getCalendarDays();

  function addToCalendar() {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mohamed and Asmaa Wedding//EN",
      "BEGIN:VEVENT",
      "UID:mohamed-asmaa-wedding-2026@example.com",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20261110T170000",
      "DTEND:20261110T230000",
      "SUMMARY:Mohamed & Asmaa Wedding",
      "DESCRIPTION:We are getting married. We would be happy to celebrate this special day with you.",
      "LOCATION:Wedding Venue",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([event], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "mohamed-asmaa-wedding.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setAdded(true);
  }

  return (
    <section className="calendar-section" id="calendar">
      {/* زخارف الخلفية */}
      <div className="calendar-decoration calendar-decoration-one">
        ✦
      </div>

      <div className="calendar-decoration calendar-decoration-two">
        ❀
      </div>

      <div className="calendar-decoration calendar-decoration-three">
        ♥
      </div>

      <div className="calendar-decoration calendar-decoration-four">
        ✧
      </div>

      <div className="calendar-decoration calendar-decoration-five">
        ❁
      </div>

      <div className="calendar-decoration calendar-decoration-six">
        ♡
      </div>

      <div className="calendar-heading">
        <span>✦</span>
        <p>Save the date</p>
        <span>✦</span>
      </div>

      <h2>Mark your calendar</h2>

      <div className="calendar-card">
        <div className="calendar-flower flower-left">
          ❀
        </div>

        <div className="calendar-flower flower-right">
          ❀
        </div>

        <h3>
          November {year}
        </h3>

        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className={`calendar-day ${
                day === selectedDay ? "selected-day" : ""
              }`}
            >
              {day && (
                <>
                  <span>{day}</span>

                  {day === selectedDay && (
                    <small className="calendar-heart">
                      ♥
                    </small>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="calendar-button"
          onClick={addToCalendar}
        >
          {added ? "Added to calendar ✓" : "Add to calendar"}
        </button>
      </div>

      <div className="calendar-bottom-decoration">
        <span>✿</span>
        <span>♡</span>
        <span>✿</span>
      </div>
    </section>
  );
}
