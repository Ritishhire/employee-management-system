import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  EyeOff,
  Eye,
  Loader2,
  Sun,
  Moon,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthUserStore } from "../Store/useAuthUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../Components/LanguageSelector";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, authUser, theme, toggleTheme } = useAuthUserStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (authUser) navigate("/home");
  }, [authUser, navigate]);

  // Apply theme on login page mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const validateForm = () => {
    if (!formData.email.trim()) { toast.error("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("Invalid email"); return false; }
    if (!formData.password.trim()) { toast.error("Password is required"); return false; }
    if (formData.password.length < 4) { toast.error("Password must be at least 4 characters"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const success = await login(formData);
      if (success) {
        toast.success("Identity Verified");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Access Denied: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden transition-colors duration-500">

      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-[100px] -top-20 -left-20"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-[100px] bottom-0 right-0"
      />

      {/* Theme toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all z-10 shadow-xl"
        title="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {theme === 'light' ? (
            <motion.div key="moon" initial={{ opacity: 0, rotate: -40 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 40 }} transition={{ duration: 0.2 }}>
              <Moon size={20} />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ opacity: 0, rotate: 40 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -40 }} transition={{ duration: 0.2 }}>
              <Sun size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-24 z-10 w-40"
      >
        <LanguageSelector />
      </motion.div>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-8 sm:p-12 mx-4 relative z-10"
      >

        {/* Header */}
        <div className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-teal-500/20"
            >
              <ShieldAlert className="text-white" size={32} />
            </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            {t('login.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-[10px]"
          >
            {t('login.subtitle')}
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{t('login.emailLabel')}</label>

            <div className="relative mt-2 group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />

              <input
                type="text"
                placeholder={t('login.emailPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 
                focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{t('login.passwordLabel')}</label>

            <div className="relative mt-2 group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 
                focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-teal-500/20 disabled:opacity-70 mt-4 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin size-5" />
                {t('login.validating')}
              </>
            ) : (
              t('login.button')
            )}
          </motion.button>

        </form>
      </motion.div>

      {/* Footer Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]"
      >
        {t('login.footer')}
      </motion.div>

    </div>
  );
};

export default Login;