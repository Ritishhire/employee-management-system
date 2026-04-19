import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { 
    User, 
    Mail, 
    Shield, 
    Briefcase, 
    Calendar, 
    DollarSign, 
    MapPin,
    Smartphone,
    Award,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Profile = () => {
    const { t } = useTranslation();
    const { authUser } = useAuthUserStore();

    if (!authUser) return null;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950 min-h-full transition-colors duration-300">
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto space-y-8"
            >
                
                {/* PROFILE HUB HEADER */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-3xl opacity-60"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        {/* AVATAR with Animation */}
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-5xl sm:text-6xl font-black text-white shadow-2xl border-4 border-white dark:border-slate-700"
                        >
                            {authUser.name.charAt(0).toUpperCase()}
                        </motion.div>

                        <div className="text-center md:text-left flex-1">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col md:flex-row md:items-center gap-3"
                            >
                                <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {authUser.name}
                                </h1>
                                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100 dark:border-teal-700">
                                    {authUser.role}
                                </span>
                            </motion.div>
                            <p className="text-slate-400 dark:text-slate-500 mt-3 font-medium text-lg leading-relaxed max-w-lg">
                                {t('profile.subtitle')}
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-bold border border-slate-100 dark:border-slate-700">
                                    <MapPin size={16} /> {t('profile.remoteGlobal')}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-bold border border-slate-100 dark:border-slate-700">
                                    <Smartphone size={16} /> {t('profile.encryptedAccess')}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* ACCOUNT DETAILS */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('profile.accountEssentials')}</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <Mail className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" size={20} />
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.verifiedEmail')}</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{authUser.email}</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <Shield className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" size={20} />
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.securityClearance')}</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{authUser.role}</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <Calendar className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" size={20} />
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.onboardingDate')}</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {new Date(authUser.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* JOB INFORMATION */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                <Award size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('profile.professionalProfile')}</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <Briefcase className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" size={20} />
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.assignedPost')}</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                                    {authUser.role === "admin" ? t('profile.assignedPost') : (authUser.position || "Senior Associate")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <DollarSign className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" size={20} />
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('profile.compensation')}</span>
                                </div>
                                <span className="font-black text-slate-900 dark:text-teal-400">
                                    {authUser.salary ? `INR ${authUser.salary.toLocaleString()}` : t('profile.confidential')}
                                </span>
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-10 p-5 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-700/50 flex items-start gap-4"
                        >
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm animate-pulse">
                                <Sparkles className="text-teal-500" size={18} />
                            </div>
                            <p className="text-xs font-bold text-teal-700 dark:text-teal-400 leading-relaxed uppercase tracking-wider">
                                {t('profile.syncMessage')}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;