import React, { useEffect } from 'react'
import SideBar from '../../Components/sideBar.jsx'
import Dashboard from '../../Components/Dashboard.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuthUserStore } from '../Store/useAuthUserStore.js';
import Users from '../../Components/Users.jsx';
import Departments from '../../Components/Department.jsx';
import DepartmentDetail from '../../Components/DepartmentDetail.jsx';
import Profile from '../../Components/Profile.jsx';
import Attendance from './Attendance.jsx';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const Home = () => {
  const navigate = useNavigate();
  const { authUser, activeSection, isMobileSidebarOpen, toggleMobileSidebar, theme } = useAuthUserStore();

  useEffect(() => {
    if (!authUser) navigate('/');
  }, [authUser, navigate]);

  // Apply theme class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <Dashboard />;
      case "users": return <Users />;
      case "departments": return <Departments />;
      case "departmentdetail": return <DepartmentDetail />;
      case "profile": return <Profile />;
      case "attendance": return <Attendance />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 relative transition-colors duration-300">

      {/* MOBILE HEADER */}
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleMobileSidebar(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 dark:text-white tracking-tight">EMS</span>
        </div>
        <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/40 px-3 py-1 rounded-full">
          {activeSection}
        </div>
      </header>

      {/* SIDEBAR OVERLAY (MOBILE) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30"
            onClick={() => toggleMobileSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto
        transition-transform duration-300 transform
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SideBar />
      </div>

      <main className="flex-1 h-screen overflow-y-auto pt-16 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
};

export default Home;