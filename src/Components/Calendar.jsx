import React, { useState } from "react";

const Calendar = ({ onDateSelect }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Include dates from the previous and next months
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const calendarDays = Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, month, index - firstDay + 1);

    return {
      date,
      day: date.getDate(),
      outsideMonth: date.getMonth() !== month,
    };
  });

  const isSameDay = (date1, date2) => {
    return (
      date1 &&
      date2 &&
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const changeMonth = (amount) => {
    setCurrentMonth(new Date(year, month + amount, 1));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onDateSelect?.(date);

    if (date.getMonth() !== month) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    handleDateSelect(today);
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <div className="calendar-heading">
          <h3>{monthName}</h3>
          <p>Select a date for your appointment</p>
        </div>

        <div className="calendar-navigation">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map(({ date, day, outsideMonth }) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              type="button"
              key={date.toISOString()}
              className={[
                "calendar-day",
                outsideMonth ? "outside-month" : "",
                isSelected ? "selected-day" : "",
                isToday ? "today-day" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleDateSelect(date)}
              aria-label={date.toLocaleDateString("en-US", {
                dateStyle: "full",
              })}
              aria-pressed={!!isSelected}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="calendar-footer">
        <button
          type="button"
          className="calendar-today-btn"
          onClick={goToToday}
        >
          Today
        </button>

        <span className="calendar-selected-date">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "No date selected"}
        </span>
      </div>
    </div>
  );
};

export default Calendar;
