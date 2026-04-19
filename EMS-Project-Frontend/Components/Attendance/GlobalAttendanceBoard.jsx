import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  Activity,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useAttendanceStore } from "../../src/Store/useAttendanceStore";
import { useTranslation } from "react-i18next";

const GlobalAttendanceBoard = ({ onUserClick }) => {
  const { t } = useTranslation();
  const { getAllAttendance } = useAttendanceStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const data = await getAllAttendance(selectedDate);
      setRecords(data);
      setIsLoading(false);
    };
    fetchAll();
  }, [selectedDate, getAllAttendance]);

  const filteredRecords = records.filter(r => {
    const user = r.user || {};
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const role = (user.role || "").toLowerCase();
    const position = (user.position || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || 
           email.includes(query) || 
           role.includes(query) || 
           position.includes(query);
  });

  const stats = {
    total: records.length,
    active: records.filter(r => r.isPunchedIn).length,
    completed: records.filter(r => !r.isPunchedIn && r.totalMinutes > 0).length,
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('attendance.totalActive'), value: stats.active, icon: Activity, color: "teal" },
          { label: t('attendance.completedShifts'), value: stats.completed, icon: Clock, color: "indigo" },
          { label: t('attendance.totalRecords'), value: stats.total, icon: Users, color: "slate" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('users.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-1 md:flex-initial items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <CalendarIcon size={18} className="text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-700 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.user')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('users.status')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('attendance.totalHours')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('attendance.lastEntry')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{t('common.loading')}</p>
                       </div>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <p className="text-slate-400 font-medium">{t('common.noResults')}</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record, i) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.05 }}
                      layout
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
                      onClick={() => onUserClick(record)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">{record.user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.user?.position || record.user?.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                          ${record.isPunchedIn 
                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-700" 
                            : "bg-slate-50 dark:bg-slate-900/30 text-slate-500 border-slate-100 dark:border-slate-700"
                          }
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${record.isPunchedIn ? "bg-teal-500 animate-pulse" : "bg-slate-400"}`}></div>
                          {record.isPunchedIn ? t('attendance.currentlyActive') : t('attendance.systemStandby')}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-700 dark:text-white">
                          {Math.floor(record.totalMinutes / 60)}h {record.totalMinutes % 60}m
                        </p>
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                           {record.logs.length > 0 
                             ? new Date(record.logs[record.logs.length - 1].punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                             : "--:--"
                           }
                         </p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => onUserClick(record)}
                          className="p-2 text-slate-300 hover:text-teal-500 transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GlobalAttendanceBoard;
