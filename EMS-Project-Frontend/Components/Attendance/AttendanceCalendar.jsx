import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Circle,
  Clock,
  ArrowRight,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";

const AttendanceCalendar = ({ records = [], onDayClick }) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const getDayRecord = (day) => {
    return records.find(r => {
      const recordDate = new Date(r.date);
      return recordDate.getUTCDate() === day && 
             recordDate.getUTCMonth() === currentDate.getMonth() &&
             recordDate.getUTCFullYear() === year;
    });
  };

  const dayNames = [
    t('common.days.sun'), t('common.days.mon'), t('common.days.tue'), 
    t('common.days.wed'), t('common.days.thu'), t('common.days.fri'), t('common.days.sat')
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {monthName} {year}
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              {t('attendance.historyReport')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl">
          <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-black text-slate-600 dark:text-slate-300">
            {t('common.today')}
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-4">
        {dayNames.map(day => (
          <div key={day} className="py-2 text-center text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-3">
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const record = getDayRecord(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDayClick(record || { date: new Date(Date.UTC(year, currentDate.getMonth(), day)) })}
              className={`
                relative aspect-square rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center justify-center gap-1
                ${record 
                  ? "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-400" 
                  : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                }
                ${isToday ? "ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900" : ""}
              `}
            >
              <span className="text-sm sm:text-lg font-black">{day}</span>
              {record && (
                <div className="hidden sm:flex items-center gap-0.5 text-[9px] font-bold opacity-80 uppercase tracking-tighter">
                  <Clock size={10} />
                  {Math.floor(record.totalMinutes / 60)}h {record.totalMinutes % 60}m
                </div>
              )}
              {record && (
                 <motion.div 
                    layoutId={`badge-${day}`}
                    className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full border-2 border-white dark:border-slate-800"
                 />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-6 pt-8 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-teal-500"></div>
           <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('attendance.status.present')}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></div>
           <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('attendance.status.noData')}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
           <Info size={14} className="text-slate-400" />
           <span className="text-xs font-medium text-slate-400">{t('attendance.clickForDetails')}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
