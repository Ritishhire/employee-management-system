import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAttendanceStore } from "../Store/useAttendanceStore.js";
import { useAuthUserStore } from "../Store/useAuthUserStore.js";
import PunchControl from "../../Components/Attendance/PunchControl.jsx";
import AttendanceCalendar from "../../Components/Attendance/AttendanceCalendar.jsx";
import GlobalAttendanceBoard from "../../Components/Attendance/GlobalAttendanceBoard.jsx";
import { useTranslation } from "react-i18next";
import { 
  X, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Activity,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";

const DayDetailModal = ({ record, onClose }) => {
  const { t } = useTranslation();
  if (!record) return null;

  const logs = record.logs || [];
  const formattedDate = new Date(record.date).toLocaleDateString('default', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {t('attendance.dailyDetail')}
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              {formattedDate}
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <ShieldAlert className="mx-auto text-slate-200 dark:text-slate-700 mb-4" size={48} />
              <p className="text-slate-400 font-medium">{t('attendance.noPunches')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                     {idx + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('attendance.punchIn')}</p>
                      <p className="text-sm font-black text-slate-700 dark:text-white">
                        {new Date(log.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('attendance.punchOut')}</p>
                      <p className="text-sm font-black text-slate-700 dark:text-white">
                        {log.punchOut ? new Date(log.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-500 rounded-xl text-white">
                <Clock size={18} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400">{t('attendance.totalHours')}</p>
                <p className="text-lg font-black text-slate-800 dark:text-white">
                   {Math.floor((record.totalMinutes || 0) / 60)}h {(record.totalMinutes || 0) % 60}m
                </p>
             </div>
          </div>
          {record.isAutoPunchedOut && (
            <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100 dark:border-amber-700">
               Auto-Closed (12h)
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Attendance = () => {
  const { t } = useTranslation();
  const { authUser } = useAuthUserStore();
  const { attendanceRecords, fetchMyAttendance, isLoading } = useAttendanceStore();
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const now = new Date();
    fetchMyAttendance(now.getMonth(), now.getFullYear());
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <Activity className="text-teal-500" size={32} />
            {t('attendance.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('attendance.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
            <UserIcon size={24} />
          </div>
          <div className="pr-4 min-w-[120px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
               {authUser?.role}
            </p>
            <p className="text-sm font-black text-slate-800 dark:text-white">{authUser?.name}</p>
          </div>
        </div>
      </div>

      {authUser?.role === 'admin' ? (
        <GlobalAttendanceBoard onUserClick={(record) => setSelectedDay(record)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
              <PunchControl />
          </div>
          <div className="lg:col-span-2">
              <AttendanceCalendar 
                records={attendanceRecords} 
                onDayClick={(day) => setSelectedDay(day)}
              />
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedDay && (
          <DayDetailModal 
            record={selectedDay} 
            onClose={() => setSelectedDay(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
