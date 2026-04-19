import { useEffect, useState, useMemo } from "react";
import { useDepartmentStore } from "../src/Store/useDepartmentStore";
import { 
    Building2, 
    Search, 
    Plus, 
    ArrowRight, 
    UserCheck, 
    MoreHorizontal,
    LayoutGrid,
    AlertCircle
} from "lucide-react";
import AddDepartmentModal from "../Modals/AddDepartmentModal";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { motion, AnimatePresence } from "framer-motion";
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
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Departments = () => {
    const { t } = useTranslation();
    const { departments, getDepartmentDetails, getDepartments, isLoading } = useDepartmentStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { authUser } = useAuthUserStore();
    const role = authUser?.role;

    useEffect(() => {
        getDepartments();
    }, [getDepartments]);

    // Auto-redirect for non-admins if they have a department
    useEffect(() => {
        if (role !== "admin" && departments.length === 1) {
            handleDepartmentClick(departments[0]._id);
        }
    }, [departments, role]);

    const handleDepartmentClick = async (deptId) => {
        const result = await getDepartmentDetails(deptId);
        if(result) {
            useAuthUserStore.setState({ activeSection: "departmentdetail" });
        }
    }

    const filteredDepartments = useMemo(() => {
        if (!departments) return [];
        return departments.filter(dept => 
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (dept.managerName && dept.managerName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [departments, searchTerm]);

    if (role !== "admin" && isLoading) {
         return (
            <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center transition-colors">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-4">Gathering department insights...</p>
            </div>
         );
    }

    if (role === "manager" && departments.length === 0 && !isLoading) {
        return (
            <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center transition-colors">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center max-w-lg"
                >
                    <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-lg">
                        You haven't been assigned to lead any department yet. Please reach out to your administrator.
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950 min-h-full transition-colors duration-300">

            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* HEADER SECTION */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <motion.div 
                                whileHover={{ rotate: 90 }}
                                className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 dark:bg-teal-600 text-white shadow-xl shadow-slate-200 dark:shadow-none"
                            >
                                <LayoutGrid size={24} />
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                                {role === "admin" ? t('departments.title') : t('departments.myDepartment')}
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                            {role === "admin" ? t('departments.subtitleAdmin') : t('departments.subtitleManager')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {role === "admin" && (
                            <div className="relative group w-full sm:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder={t('departments.searchPlaceholder')}
                                    className="w-full text-black dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}

                        {role === "admin" && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAddOpen(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-teal-100 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
                            >
                                <Plus size={20} />
                                {t('departments.newDepartment')}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* GRID SECTION */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredDepartments.length === 0 ? (
                                <motion.div 
                                    key="no-results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full text-center py-32 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center"
                                >
                                    <div className="p-6 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 mb-6">
                                        <Building2 size={64} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('departments.noDepartments')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search criteria or add a new department.</p>
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm("")} className="mt-4 text-teal-600 dark:text-teal-400 font-bold hover:underline">Reset Search</button>
                                    )}
                                </motion.div>
                            ) : (
                                filteredDepartments.map((dept) => (
                                    <motion.div
                                        key={dept._id}
                                        layout
                                        variants={itemVariants}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100 dark:hover:shadow-none transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between h-64 sm:h-72"
                                        onClick={() => handleDepartmentClick(dept._id)}
                                    >
                                        {/* Decorative Glow */}
                                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-teal-50 dark:bg-teal-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>

                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-inner group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                                                    <Building2 size={24} />
                                                </div>
                                                <div className="text-slate-300 dark:text-slate-600 hover:text-teal-600 transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-6 tracking-tight group-hover:translate-x-1 transition-transform">
                                                {dept.name}
                                            </h2>

                                            {/* MANAGER BADGE */}
                                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                <div className={`p-1.5 rounded-lg ${dept.managerName ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 italic'}`}>
                                                    <UserCheck size={14} />
                                                </div>
                                                <span className={!dept.managerName ? 'text-xs text-rose-400' : ''}>
                                                    {dept.managerName ? `${t('departments.ledBy')} ${dept.managerName}` : t('departments.noManager')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* FOOTER STATS */}
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center -space-x-2">
                                                    {[1, 2].map(i => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
                                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500"></div>
                                                        </div>
                                                    ))}
                                                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-300">
                                                        +{dept.employeeCount || 0}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('departments.teamSize')}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                                {t('departments.details')} <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <AddDepartmentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Departments;
