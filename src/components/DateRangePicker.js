import React, { useState, useEffect, useRef } from "react";
import calendarIcon from "../assets/icons/calendar.svg";
import "../styles/DateRangePicker.css";

const DateRangePicker = ({ onChange, displayValue, onDisplayValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    const dateStr = date.toDateString();
    return (
      (startDate && startDate.toDateString() === dateStr) ||
      (endDate && endDate.toDateString() === dateStr)
    );
  };

  const getHoverRange = () => {
    if (!startDate || endDate || !hoverDate) return { min: null, max: null };
    const min = startDate < hoverDate ? startDate : hoverDate;
    const max = startDate > hoverDate ? startDate : hoverDate;
    // Normalize dates to start of day for comparison
    const minNormalized = new Date(
      min.getFullYear(),
      min.getMonth(),
      min.getDate()
    );
    const maxNormalized = new Date(
      max.getFullYear(),
      max.getMonth(),
      max.getDate()
    );
    return { min: minNormalized, max: maxNormalized };
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (!date || isDateDisabled(date)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      if (onChange) {
        onChange({ startDate: date, endDate: null });
      }
      if (onDisplayValueChange) {
        const formatDateForDisplay = (d) => {
          const month = d.toLocaleDateString("en-US", { month: "short" });
          const day = d.getDate();
          return `${day} ${month.toLowerCase()}`;
        };
        onDisplayValueChange(formatDateForDisplay(date));
      }
    } else if (startDate && !endDate) {
      let newStart = startDate;
      let newEnd = date;

      if (date < startDate) {
        newStart = date;
        newEnd = startDate;
      }

      setStartDate(newStart);
      setEndDate(newEnd);

      if (onChange) {
        onChange({ startDate: newStart, endDate: newEnd });
      }

      if (onDisplayValueChange) {
        const formatDateForDisplay = (d) => {
          const month = d.toLocaleDateString("en-US", { month: "short" });
          const day = d.getDate();
          return `${day} ${month.toLowerCase()}`;
        };
        const formatted =
          newStart && newEnd
            ? newStart.toLocaleDateString("en-US", { month: "short" }) ===
              newEnd.toLocaleDateString("en-US", { month: "short" })
              ? `${newStart.getDate()} - ${newEnd.getDate()} ${newStart
                  .toLocaleDateString("en-US", { month: "short" })
                  .toLowerCase()}`
              : `${formatDateForDisplay(newStart)} - ${formatDateForDisplay(
                  newEnd
                )}`
            : "";
        onDisplayValueChange(formatted);
      }
    }
  };

  const handleApply = () => {
    if (startDate && endDate && onChange) {
      onChange({ startDate, endDate });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    if (onChange) onChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const month1 = currentMonth;
  const month2 = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );
  const month1Days = getMonthDays(month1);
  const month2Days = getMonthDays(month2);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="date-range-picker" ref={pickerRef}>
      <button
        className="date-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={calendarIcon} alt="Calendar" className="date-picker-icon" />
        <span className="date-picker-trigger-content">
          <span>{displayValue || "Select dates"}</span>
          {displayValue && displayValue.includes(",") && (
            <span className="date-picker-time">
              {displayValue.split(",").pop().trim()}
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="calendar-container">
            {/* Month 1 */}
            <div className="calendar-month">
              <div className="calendar-header">
                <button className="calendar-nav-button" onClick={prevMonth}>
                  ←
                </button>
                <span className="calendar-month-title">
                  {getMonthYear(month1)}
                </span>
              </div>
              <div className="calendar-weekdays">
                {weekDays.map((day) => (
                  <div key={day} className="calendar-weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-days">
                {month1Days.map((date, idx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="calendar-day empty"
                      />
                    );
                  }

                  const isSelected = isDateSelected(date);
                  const inRange = isDateInRange(date);
                  const hoverRange = getHoverRange();
                  const inHoverRange =
                    hoverRange.min &&
                    hoverRange.max &&
                    date >= hoverRange.min &&
                    date <= hoverRange.max &&
                    !isSelected;
                  const isStart =
                    startDate &&
                    date.toDateString() === startDate.toDateString();
                  const isEnd =
                    endDate && date.toDateString() === endDate.toDateString();
                  const isHoverStart =
                    hoverRange.min &&
                    date.toDateString() === hoverRange.min.toDateString() &&
                    !isStart;
                  const isHoverEnd =
                    hoverRange.max &&
                    date.toDateString() === hoverRange.max.toDateString() &&
                    !isEnd;
                  const isDisabled = isDateDisabled(date);
                  const isFirst = idx === 0 || month1Days[idx - 1] === null;
                  const isLast =
                    idx === month1Days.length - 1 ||
                    month1Days[idx + 1] === null;

                  return (
                    <div
                      key={date.toISOString()}
                      className={`calendar-day ${
                        isSelected ? "selected" : ""
                      } ${inRange ? "in-range" : ""} ${
                        inHoverRange ? "in-hover-range" : ""
                      } ${isStart ? "start-date" : ""} ${
                        isEnd ? "end-date" : ""
                      } ${isHoverStart ? "hover-start" : ""} ${
                        isHoverEnd ? "hover-end" : ""
                      } ${isDisabled ? "disabled" : ""} ${
                        isFirst ? "first-in-week" : ""
                      } ${isLast ? "last-in-week" : ""}`}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => {
                        if (startDate && !endDate && !isDisabled) {
                          setHoverDate(date);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!endDate) {
                          setHoverDate(null);
                        }
                      }}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Month 2 */}
            <div className="calendar-month">
              <div className="calendar-header">
                <span className="calendar-month-title">
                  {getMonthYear(month2)}
                </span>
                <button className="calendar-nav-button" onClick={nextMonth}>
                  →
                </button>
              </div>
              <div className="calendar-weekdays">
                {weekDays.map((day) => (
                  <div key={day} className="calendar-weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-days">
                {month2Days.map((date, idx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="calendar-day empty"
                      />
                    );
                  }

                  const isSelected = isDateSelected(date);
                  const inRange = isDateInRange(date);
                  const hoverRange = getHoverRange();
                  const inHoverRange =
                    hoverRange.min &&
                    hoverRange.max &&
                    date >= hoverRange.min &&
                    date <= hoverRange.max &&
                    !isSelected;
                  const isStart =
                    startDate &&
                    date.toDateString() === startDate.toDateString();
                  const isEnd =
                    endDate && date.toDateString() === endDate.toDateString();
                  const isHoverStart =
                    hoverRange.min &&
                    date.toDateString() === hoverRange.min.toDateString() &&
                    !isStart;
                  const isHoverEnd =
                    hoverRange.max &&
                    date.toDateString() === hoverRange.max.toDateString() &&
                    !isEnd;
                  const isDisabled = isDateDisabled(date);
                  const isFirst = idx === 0 || month2Days[idx - 1] === null;
                  const isLast =
                    idx === month2Days.length - 1 ||
                    month2Days[idx + 1] === null;

                  return (
                    <div
                      key={date.toISOString()}
                      className={`calendar-day ${
                        isSelected ? "selected" : ""
                      } ${inRange ? "in-range" : ""} ${
                        inHoverRange ? "in-hover-range" : ""
                      } ${isStart ? "start-date" : ""} ${
                        isEnd ? "end-date" : ""
                      } ${isHoverStart ? "hover-start" : ""} ${
                        isHoverEnd ? "hover-end" : ""
                      } ${isDisabled ? "disabled" : ""} ${
                        isFirst ? "first-in-week" : ""
                      } ${isLast ? "last-in-week" : ""}`}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => {
                        if (startDate && !endDate && !isDisabled) {
                          setHoverDate(date);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!endDate) {
                          setHoverDate(null);
                        }
                      }}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="date-picker-actions">
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
            <button
              onClick={handleApply}
              className="apply-button"
              disabled={!startDate || !endDate}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
