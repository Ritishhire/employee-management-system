import { useState, useEffect } from "react";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { 
    UserCheck, 
    X, 
    User, 
    Mail, 
    ShieldCheck, 
    Edit3,
    Lock,
    Banknote,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSelect from "../Components/UI/AnimatedSelect";

/** Professional corporate-grade user update modal with Framer Motion */
const UpdateUserModal = ({ isOpen, onClose, user }) => {
    const { updateUser, getUsers } = useAuthUserStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "employee",
        password: "",
        isActive: true,
        salary: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "employee",
                password: "",
                isActive: user.isActive !== undefined ? user.isActive : true,
                salary: user.salary || "",
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateUser(user._id, formData);
        setLoading(false);
        if (success) {
            await getUsers();
            onClose();
        }
    };

    const roleOptions = [
        { value: "employee", label: "Standard Employee" },
        { value: "manager", label: "Lead Manager" },
        { value: "admin", label: "System Administrator" },
    ];

    const statusOptions = [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden border dark:border-slate-800 transition-colors"
            >
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <motion.div 
                            whileHover={{ rotate: 15 }}
                            className="p-2 rounded-lg bg-teal-600 text-white shadow-md shadow-teal-900/10"
                        >
                            <Edit3 size={18} />
                        </motion.div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Modify Identity</h2>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Update Authorization & Details</p>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Name */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full text-black dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all text-sm font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                                <input
                                    type="email"
                                    placeholder="user@ems.corp"
                                    className="w-full text-black dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all text-sm font-bold"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Role with AnimatedSelect */}
                        <AnimatedSelect
                            label="Authority Level"
                            placeholder="Select Role"
                            icon={ShieldCheck}
                            options={roleOptions}
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val })}
                        />

                        {/* Status with AnimatedSelect */}
                        <AnimatedSelect
                            label="Account Status"
                            placeholder="Select Status"
                            icon={Activity}
                            options={statusOptions}
                            value={formData.isActive ? "true" : "false"}
                            onChange={(val) => setFormData({ ...formData, isActive: val === "true" })}
                        />

                        {/* Salary */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Compensation</label>
                            <div className="relative group">
                                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                                <input
                                    type="number"
                                    placeholder="Base Salary"
                                    className="w-full text-black dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all text-sm font-bold"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password (Optional)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                                <input
                                    type="password"
                                    placeholder="Keep empty to skip"
                                    className="w-full text-black dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all text-sm font-bold"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 rounded-xl bg-slate-900 dark:bg-teal-600 text-teal-400 dark:text-white font-black text-xs tracking-widest uppercase hover:bg-slate-800 dark:hover:bg-teal-500 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserCheck size={16} />
                                    Save Modifications
                                </>
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs tracking-widest uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            Dismiss Request
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateUserModal;