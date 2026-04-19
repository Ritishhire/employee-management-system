import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Clock, Loader2, Zap, ShieldCheck, PlayCircle } from "lucide-react";
import { useAttendanceStore } from "../../src/Store/useAttendanceStore";
import { useTranslation } from "react-i18next";

const PunchControl = () => {
  const { t } = useTranslation();
  const { currentDayRecord, punch, isLoading } = useAttendanceStore();
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const isPunchedIn = currentDayRecord?.isPunchedIn;

  useEffect(() => {
    let interval;
    if (isPunchedIn && currentDayRecord?.logs?.length > 0) {
      const lastLog = currentDayRecord.logs[currentDayRecord.logs.length - 1];
      const startTime = new Date(lastLog.punchIn);

      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now - startTime;
        
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, currentDayRecord]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 min-h-[400px] flex flex-col"
    >
      {/* Visual Accents */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isPunchedIn ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
      
      <div className="p-8 flex-1 flex flex-col items-center justify-between z-10">
        {/* Status Header */}
        <div className="w-full text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Zap size={12} className={isPunchedIn ? "text-teal-500 animate-pulse" : ""} />
            {t('attendance.terminalStatus')}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {isPunchedIn ? t('attendance.currentlyActive') : t('attendance.systemStandby')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm px-4">
              {isPunchedIn ? t('attendance.activeDesc') : t('attendance.standbyDesc')}
            </p>
          </div>
        </div>

        {/* Timer/Visual State */}
        <div className="relative py-12">
          <AnimatePresence mode="wait">
            {isPunchedIn ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                   <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                   <div className="relative flex flex-col items-center justify-center w-48 h-48 border-4 border-teal-500 rounded-full bg-white dark:bg-slate-800 shadow-2xl">
                      <Clock size={32} className="text-teal-500 mb-2" />
                      <span className="text-2xl font-black font-mono text-slate-800 dark:text-white">
                        {elapsedTime}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {t('attendance.currentSession')}
                      </span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="standby"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-slate-200 dark:text-slate-700"
              >
                 <PlayCircle size={120} strokeWidth={1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={punch}
            disabled={isLoading}
            className={`
              relative w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl flex items-center justify-center gap-4
              ${isPunchedIn 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30" 
                : "bg-slate-900 dark:bg-teal-600 hover:bg-black dark:hover:bg-teal-500 text-white shadow-slate-900/20 dark:shadow-teal-500/20"
              }
              ${isLoading ? "opacity-70 cursor-wait" : ""}
            `}
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-6" />
            ) : isPunchedIn ? (
              <>
                <div className="p-1 px-3 bg-white/20 rounded-lg">
                   <LogOut size={18} />
                </div>
                {t('attendance.punchOut')}
              </>
            ) : (
              <>
                <div className="p-1 px-3 bg-white/20 rounded-lg">
                   <LogIn size={18} />
                </div>
                {t('attendance.punchIn')}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PunchControl;
