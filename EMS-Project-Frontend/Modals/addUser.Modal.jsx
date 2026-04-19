import { useState } from "react";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import { UserPlus, X, Shield, Activity, User, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSelect from "../Components/UI/AnimatedSelect";

const AddUserModal = ({ isOpen, onClose }) => {
    const { addUser } = useAuthUserStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await addUser(formData);
        setLoading(false);

        if (success) {
            onClose();
            // reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "employee",
                isActive: true,
            });
        }
    };

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "employee", label: "Employee" },
    ];

    const statusOptions = [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md p-5 sm:p-8 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto border dark:border-slate-800 transition-colors"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 transition-colors">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                    >
                        <UserPlus size={24} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Create New User</h2>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="ml-auto p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 pl-11 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 pl-11 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Temporary Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 pl-11 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Role with AnimatedSelect */}
                        <AnimatedSelect
                            label="Assign Role"
                            placeholder="Select Role"
                            icon={Shield}
                            options={roleOptions}
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val })}
                        />

                        {/* Status with AnimatedSelect */}
                        <AnimatedSelect
                            label="Initial Status"
                            placeholder="Select Status"
                            icon={Activity}
                            options={statusOptions}
                            value={formData.isActive ? "true" : "false"}
                            onChange={(val) => setFormData({ ...formData, isActive: val === "true" })}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            Cancel
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-3.5 rounded-2xl bg-teal-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-100 dark:shadow-none hover:bg-teal-500 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Create User</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddUserModal;