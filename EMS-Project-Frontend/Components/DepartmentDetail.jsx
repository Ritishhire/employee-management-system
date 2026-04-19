import { useEffect, useState } from "react";
import UpdateDepartmentModal from "../Modals/UpdateDepartmentModal";
import ConfirmModal from "../Modals/ConfirmModal";
import AssignUserModal from "../Modals/AssignUserModal";
import { useDepartmentStore } from "../src/Store/useDepartmentStore";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
    ArrowLeft, 
    User as UserIcon, 
    Users as UsersIcon, 
    Building2, 
    Calendar,
    Settings2,
    Trash2,
    PlusCircle,
    Mail,
    Briefcase,
    DollarSign,
    AlertCircle
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DepartmentDetail = () => {
    const { t } = useTranslation();

    const { authUser, getUsers } = useAuthUserStore();
    const { selectedDepartment, isLoading, removeDepartmentUser, deleteDepartment } = useDepartmentStore();
    const role = authUser?.role;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [confirmData, setConfirmData] = useState(null);

    if (isLoading) return (
        <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center transition-colors">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-4">{t('common.loading')}... </p>
        </div>
    );
    if (!selectedDepartment) return (
        <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center transition-colors">
            <AlertCircle className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400 font-bold">{t('common.notFound')}</p>
        </div>
    );

    const { department, manager, employees } = selectedDepartment;
    const filteredEmployees = employees.filter((emp) => emp.role !== "manager");

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950 min-h-full transition-colors duration-300">

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
            >

                {/* TOP BAR */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <motion.button
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => useAuthUserStore.setState({
                            activeSection: "departments",
                            selectedDepartment: null
                        })}
                        className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-all"
                    >
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-teal-200 dark:group-hover:border-teal-600 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        {t('departmentDetail.backToDepartments')}
                    </motion.button>

                    <div className="flex gap-3 w-full sm:w-auto">
                        {role === "admin" && (
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-4 sm:px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
                                onClick={() => {
                                    setConfirmData({
                                        title: t('common.delete'),
                                        message: `${t('common.confirmDelete')} "${department.name}"?`,
                                        onConfirm: async () => {
                                            const success = await deleteDepartment(department._id);
                                            if (success) {
                                                useAuthUserStore.setState({ activeSection: "departments", selectedDepartment: null });
                                            }
                                            setConfirmData(null);
                                        }
                                    });
                                }}
                            >
                                <Trash2 size={18} />
                                <span className="hidden sm:inline">Delete</span>
                            </motion.button>
                        )}

                        {(role === "admin" || role === "manager") && (
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white px-4 sm:px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Settings2 size={18} />
                                <span className="hidden sm:inline">{t('common.update')}</span>
                                <span className="sm:hidden">{t('common.updateShort')}</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* HERO HEADER */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-10 border border-slate-100 dark:border-slate-700 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50"></div>
                    
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                        <motion.div 
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center bg-teal-600 text-white rounded-2xl sm:rounded-[1.5rem] shadow-xl shadow-teal-100 dark:shadow-teal-900/30"
                        >
                            <Building2 className="size-6 sm:size-9" />
                        </motion.div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {department.name}
                                </h1>
                                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-700">
                                    {t('users.active')}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-slate-400 font-medium text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(department.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                                <div className="flex items-center gap-1.5">
                                    <UsersIcon size={14} />
                                    {employees.length} {t('departmentDetail.totalMembers')}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* MANAGER & EMPLOYEES GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* MANAGER CARD */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="lg:col-span-1 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                <UserIcon size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t('departmentDetail.manager')}</h2>
                        </div>

                        {manager ? (
                            <div className="flex-1 flex flex-col">
                                <div className="flex flex-col items-center text-center mb-8 bg-slate-50/50 dark:bg-slate-700/30 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-3xl font-black mb-4 shadow-sm border-2 border-white dark:border-slate-700"
                                    >
                                        {manager.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{manager.name}</h3>
                                    <div className="flex items-center gap-1 text-slate-400 font-medium text-sm mt-1">
                                        <Briefcase size={14} />
                                        {manager.position || 'Department Head'}
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Mail size={16} />
                                            <span className="text-sm font-medium">Email</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px] sm:max-w-none">{manager.email}</span>
                                    </div>

                                    {role !== "employee" && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <DollarSign size={16} />
                                                <span className="text-sm font-medium">{t('users.pay')}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">INR {manager.salary?.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                {role === "admin" && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-auto pt-8 text-rose-500 font-bold text-sm hover:text-rose-600 transition-colors flex items-center justify-center gap-2 group"
                                        onClick={() => {
                                            setConfirmData({
                                                title: t('departments.noManager'),
                                                message: `${t('common.confirmDelete')} ${manager.name}?`,
                                                onConfirm: async () => {
                                                    await removeDepartmentUser(department._id, manager._id);
                                                    await getUsers();
                                                    setConfirmData(null);
                                                }
                                            }); 
                                        }}
                                    >
                                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                        Unassign Manager
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-700/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-600">
                                <div className="p-4 rounded-full bg-white dark:bg-slate-700 shadow-sm mb-4 text-slate-300 dark:text-slate-500">
                                    <UserIcon size={32} />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{t('departments.noManager')}</p>
                                {role === "admin" && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-4 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-widest hover:underline"
                                        onClick={() => setModalType("manager")}
                                    >
                                        <PlusCircle size={16} />
                                        Assign Now
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* EMPLOYEES SECTION */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                                    <UsersIcon size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                                    {t('departmentDetail.membersList')} <span className="text-slate-300 dark:text-slate-600 ml-1">({filteredEmployees.length})</span>
                                </h2>
                            </div>

                            {(role === "admin" || role === "manager") && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-widest hover:bg-teal-50 dark:hover:bg-teal-900/20 px-4 py-2 rounded-xl transition-all"
                                    onClick={() => setModalType("employee")}
                                >
                                    <PlusCircle size={18} />
                                    <span className="hidden sm:inline">Add Team Member</span>
                                    <span className="sm:hidden">Add</span>
                                </motion.button>
                            )}
                        </motion.div>

                        <AnimatePresence mode="popLayout">
                            {filteredEmployees.length === 0 ? (
                                <motion.div 
                                    key="empty-team"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 font-medium"
                                >
                                    <p className="text-slate-400">{t('departmentDetail.noMembers')}</p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    variants={containerVariants}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    {filteredEmployees.map(emp => (
                                        <motion.div 
                                            key={emp._id} 
                                            variants={itemVariants}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            className="group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-100 dark:border-slate-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                                    {emp.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 1)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{emp.name}</h4>
                                                    <p className="text-xs text-slate-400 font-medium">{emp.position || 'Staff'}</p>
                                                </div>
                                            </div>

                                            {(role === "admin" || role === "manager") && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-700 transition-all flex-shrink-0"
                                                    onClick={() => {
                                                        setConfirmData({
                                                            title: "Remove Employee",
                                                            message: `Unassign ${emp.name} from this department?`,
                                                            onConfirm:async () => {
                                                                await removeDepartmentUser(department._id, emp._id);
                                                                await getUsers();
                                                                setConfirmData(null);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* MODALS */}
            <AnimatePresence>
                {confirmData && (
                    <ConfirmModal
                        title={confirmData.title}
                        message={confirmData.message}
                        onConfirm={confirmData.onConfirm}
                        onCancel={() => setConfirmData(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <UpdateDepartmentModal 
                            department={department} 
                            onClose={() => setIsEditOpen(false)} 
                        />
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modalType && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <AssignUserModal
                            type={modalType}
                            departmentId={department._id}
                            onClose={() => setModalType(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentDetail;