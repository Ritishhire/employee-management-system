import { AlertTriangle, X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-sm p-6 sm:p-8 relative border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors"
            >
                
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>

                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose} 
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                    <X size={20} />
                </motion.button>

                <div className="flex flex-col items-center text-center">
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-3xl flex items-center justify-center mb-6 shadow-inner"
                    >
                        <AlertTriangle size={40} />
                    </motion.div>

                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                        Terminate Account?
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-3 leading-relaxed">
                        Are you certain you want to remove <span className="text-slate-800 dark:text-slate-200 font-bold">{user?.name}</span>? This action is irreversible.
                    </p>

                    <div className="flex w-full gap-3 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm"
                        >
                            Cancel
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onConfirm}
                            className="flex-2 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100 dark:shadow-none hover:bg-rose-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Execute Deletion
                        </motion.button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default DeleteUserModal;