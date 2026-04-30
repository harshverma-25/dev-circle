"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateInterview } from "../hooks/useInterviews";
import { 
  FiX, FiCalendar, FiClock, FiUsers, FiEdit2, 
  FiClock as FiDuration, FiChevronLeft, FiChevronRight
} from "react-icons/fi";

export default function CreateInterviewModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [date, setDate] = useState("");
  const [timeHour, setTimeHour] = useState("");
  const [timeMinute, setTimeMinute] = useState("");
  const [timeAmPm, setTimeAmPm] = useState("");
  const [duration, setDuration] = useState(60);
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);

  const { mutate, isPending } = useCreateInterview();

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          dateInputRef.current && !dateInputRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isPastDate = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    
    setDate(formattedDate);
    setSelectedDate(day);
    setShowCalendar(false);
  };

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  // Get formatted date display
  const getFormattedDate = () => {
    if (!date) return "Select date";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('default', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get time as string
  const getTimeString = () => {
    if (!timeHour || !timeMinute || !timeAmPm) return "";
    let hour = parseInt(timeHour);
    if (timeAmPm === "PM" && hour !== 12) hour += 12;
    if (timeAmPm === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}:${timeMinute}`;
  };

  const handleSubmit = () => {
    const timeString = getTimeString();
    
    if (!title || !date || !timeString) {
      alert("Please fill all fields");
      return;
    }

    const scheduledAt = new Date(`${date}T${timeString}`);
    
    // Validate that date is not in the past
    if (scheduledAt < new Date()) {
      alert("Please select a future date and time");
      return;
    }

    mutate(
      {
        title,
        maxParticipants,
        scheduledAt: scheduledAt.toISOString(),
        duration,
      },
      {
        onSuccess: onClose,
        onError: (err) => {
          console.error(err?.response?.data || err.message);
          alert(err?.response?.data?.message || "Failed to create interview");
        },
      }
    );
  };

  // Check if time is fully selected
  const isTimeSelected = timeHour && timeMinute && timeAmPm;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Create Interview</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Schedule a new practice session</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="p-5 space-y-4">
          {/* TITLE */}
          <div>
            <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium mb-1.5">
              <FiEdit2 size={12} />
              Interview Title
            </label>
            <input
              placeholder="e.g., Frontend Developer Interview"
              className="w-full px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DATE PICKER */}
          <div>
            <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium mb-1.5">
              <FiCalendar size={12} />
              Date
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                type="text"
                readOnly
                placeholder="Select date"
                className="w-full px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white placeholder-zinc-600 cursor-pointer focus:outline-none focus:border-blue-500/50 transition-all"
                value={getFormattedDate()}
                onClick={() => setShowCalendar(!showCalendar)}
              />
              
              {showCalendar && (
                <div 
                  ref={calendarRef}
                  className="absolute top-full mt-1 left-0 z-50 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-3 w-72 animate-fadeIn"
                >
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <FiChevronLeft size={14} className="text-zinc-400" />
                    </button>
                    <span className="text-white text-sm font-semibold">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <FiChevronRight size={14} className="text-zinc-400" />
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-zinc-500 text-xs py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-1.5" />
                    ))}
                    {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDate === day && 
                        date === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
                      const isPast = isPastDate(day);
                      
                      return (
                        <button
                          key={day}
                          onClick={() => !isPast && handleDateSelect(day)}
                          disabled={isPast}
                          className={`
                            p-1.5 text-center text-xs rounded-lg transition-all
                            ${isPast ? 'text-zinc-600 cursor-not-allowed' : 'text-white hover:bg-white/10'}
                            ${isSelected ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : ''}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TIME PICKER - Separate dropdowns */}
          <div>
            <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium mb-1.5">
              <FiClock size={12} />
              Time
            </label>
            <div className="flex gap-2">
              {/* Hour Dropdown */}
              <select
                value={timeHour}
                onChange={(e) => setTimeHour(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>

              {/* Minute Dropdown */}
              <select
                value={timeMinute}
                onChange={(e) => setTimeMinute(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="">Min</option>
                {['00', '15', '30', '45'].map(minute => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>

              {/* AM/PM Dropdown */}
              <select
                value={timeAmPm}
                onChange={(e) => setTimeAmPm(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* PARTICIPANTS & DURATION */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium mb-1.5">
                <FiUsers size={12} />
                Max Participants
              </label>
              <div className="flex items-center gap-1 bg-zinc-800/50 border border-white/10 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMaxParticipants(Math.max(1, maxParticipants - 1))}
                  className="w-8 h-8 rounded-l-lg text-white hover:bg-white/10 transition-all text-lg font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <span className="text-white text-sm font-semibold">{maxParticipants}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMaxParticipants(Math.min(20, maxParticipants + 1))}
                  className="w-8 h-8 rounded-r-lg text-white hover:bg-white/10 transition-all text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium mb-1.5">
                <FiDuration size={12} />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-zinc-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          {date && isTimeSelected && (
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fadeIn">
              <p className="text-blue-400 text-xs font-medium mb-0.5">Scheduled for:</p>
              <p className="text-white text-xs">
                {new Date(`${date}T${getTimeString()}`).toLocaleString('default', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 px-5 pb-5 pt-3 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending || !title || !date || !isTimeSelected}
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95"
          >
            {isPending ? "Creating..." : "Create Interview"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}