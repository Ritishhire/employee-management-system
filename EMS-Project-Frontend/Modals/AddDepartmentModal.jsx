import { useState } from "react";
import { useDepartmentStore } from "../src/Store/useDepartmentStore";
import { Building2, PlusCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const AddDepartmentModal = ({ isOpen, onClose }) => {
    const { addDepartment } = useDepartmentStore();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        const success = await addDepartment({ name });
        setLoading(false);

        if (success) {
            setName("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-5 sm:p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto transition-colors"
            >
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose} 
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                    <X size={20} />
                </motion.button>

                <div className="flex items-center gap-3 mb-8">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                    >
                        <Building2 size={24} />
                    </motion.div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        New Department
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Official Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Engineering, Sales..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            Cancel
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-teal-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-teal-100 dark:shadow-none hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <PlusCircle size={18} />
                                    <span>Create</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddDepartmentModal;