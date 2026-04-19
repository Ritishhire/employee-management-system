import { useEffect } from "react";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { useDepartmentStore } from "../src/Store/useDepartmentStore";
import { 
    Users, 
    Building2, 
    Briefcase, 
    TrendingUp, 
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Plus,
    LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StatCard = ({ title, count, icon: Icon, color, trend, trendValue, navigateTo }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
            if (navigateTo) {
                useAuthUserStore.setState({ activeSection: navigateTo });
            }
        }}
        className={`group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-100/50 dark:shadow-none transition-all duration-300 ${navigateTo ? 'cursor-pointer hover:border-teal-500/50' : ''}`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`size-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}%
                </div>
            )}
        </div>
        
        <div className="space-y-1">
            <h3 className="text-slate-400 dark:text-slate-500 text-sm font-black uppercase tracking-widest">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                    {typeof count === 'number' ? count.toLocaleString() : count}
                </span>
            </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
            <span>Live Analysis</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { t } = useTranslation();
    const { users, getUsers, authUser } = useAuthUserStore();
    const { departments, getDepartments } = useDepartmentStore();

    useEffect(() => {
        getUsers();
        getDepartments();
    }, []);

    const employeeCount = users.filter((u) => u.role === "employee").length;
    const totalSalary = users.reduce((acc, current) => acc + (current.salary || 0), 0);

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-10"
            >
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-slate-900 dark:bg-teal-600 text-white shadow-xl">
                                <LayoutDashboard size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t('dashboard.title')}</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('dashboard.greetings')}, <span className="text-teal-600 dark:text-teal-400 font-bold">{authUser?.name}</span>. {t('dashboard.blueprint')}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-teal-600 shadow-sm transition-all"
                        >
                            <Search size={20} />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                        >
                            <Plus size={20} />
                            <span>{t('dashboard.quickAction')}</span>
                        </motion.button>
                    </div>
                </div>

                {/* STATS GRID */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard 
                        title={t('dashboard.totalUsers')} 
                        count={users.length} 
                        icon={Users} 
                        color="bg-blue-500"
                        trend="up"
                        trendValue="12"
                        navigateTo="users"
                    />
                    <StatCard 
                        title={t('common.departments')} 
                        count={departments.length} 
                        icon={Building2} 
                        color="bg-teal-500"
                        trend="up"
                        trendValue="4"
                        navigateTo="departments"
                    />
                    <StatCard 
                        title={t('dashboard.totalEmployees')} 
                        count={employeeCount} 
                        icon={Briefcase} 
                        color="bg-indigo-500"
                        trend="down"
                        trendValue="2"
                        navigateTo="users"
                    />
                    <StatCard 
                        title={t('dashboard.monthlyPayroll')} 
                        count={`INR ${totalSalary.toLocaleString()}`} 
                        icon={TrendingUp} 
                        color="bg-amber-500"
                        trend="up"
                        trendValue="8"
                    />
                </motion.div>

                {/* VISUAL BREAK / CHARTS PLACEHOLDER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[400px] flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('dashboard.growthMetrics')}</h2>
                            <p className="text-slate-400 dark:text-slate-500 font-medium">Real-time engagement and expansion tracking.</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full max-w-md h-40 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                                <TrendingUp className="text-slate-200 dark:text-slate-700 mb-4" size={48} />
                                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">Matrix Visualization Coming Soon</p>
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black uppercase text-[10px] tracking-widest hover:underline"
                        >
                            View Comprehensive Report <ChevronRight size={14} />
                        </motion.button>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-slate-900 dark:bg-teal-600 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 -m-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight mb-2">{t('dashboard.structureUpdate')}</h2>
                            <p className="text-teal-100/60 font-medium text-sm leading-relaxed">Customize your departmental architecture and streamline leadership workflows.</p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ x: 10 }}
                                        className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <Building2 size={16} />
                                        </div>
                                        <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-white text-teal-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all text-center"
                                onClick={() => useAuthUserStore.setState({ activeSection: 'departments' })}
                            >
                                {t('dashboard.manageUnits')}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;