import { useState, useEffect } from "react";
import { useAuthUserStore } from "../src/Store/useAuthUserStore.js";
import { useDepartmentStore } from "../src/Store/useDepartmentStore.js";
import { UserPlus, PlusCircle, X, CheckCircle2, UserCheck, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSelect from "../Components/UI/AnimatedSelect.jsx";

const AssignUserModal = ({ type, departmentId, onClose }) => {

    const { getUsers } = useAuthUserStore();
    const users = useAuthUserStore(state => state.users);
    const createEmployee = useDepartmentStore(state => state.createEmployee);
    const selectedDepartment = useDepartmentStore(state => state.selectedDepartment);
    const { getDepartmentDetails } = useDepartmentStore();

    const [selectedUser, setSelectedUser] = useState("");
    const [position, setPosition] = useState(type === "manager" ? "Manager" : "");
    const [salary, setSalary] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredUsers = users.filter(u =>
        u.role === type &&
        !u.isEmployee &&
        !u.departmentId
    );

    useEffect(() => {
        if (!users || users.length === 0) {
            getUsers();
        }
    }, [getUsers, users]);

    useEffect(() => {
        if (type === "manager") {
            setPosition("Manager");
        } else {
            setPosition("");
        }
    }, [type]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!selectedUser || !position || !salary) return;

        setLoading(true);
        const payload = {
            userId: selectedUser,
            position,
            salary: Number(salary),
            joiningDate: new Date()
        };

        const result = await createEmployee(payload);
        
        if (result) {
            getUsers();
            const id = selectedDepartment.department._id;
            await getDepartmentDetails(id);
        }
        setLoading(false);
        onClose();
    };

    const candidateOptions = filteredUsers.map(u => ({
        value: u._id,
        label: `${u.name} — ${u.email}`
    }));

    const levelOptions = [
        { value: "Junior", label: "Junior Associate" },
        { value: "Mid-Level", label: "Mid-Level Staff" },
        { value: "Senior", label: "Senior Lead" },
        { value: "Specialist", label: "Subject Specialist" },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] w-full max-w-lg p-5 sm:p-10 shadow-2xl relative border border-slate-100 dark:border-slate-800 overflow-y-auto max-h-[90vh] transition-colors"
        >
            
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="absolute top-8 right-8 p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-10"
            >
                <X size={20} />
            </motion.button>

            <div className="flex items-center gap-4 mb-10 relative">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`p-4 rounded-2xl ${type === 'manager' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'} shadow-sm`}
                >
                    {type === 'manager' ? <UserCheck size={28} /> : <UserPlus size={28} />}
                </motion.div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        {type === "manager" ? "Appoint Leader" : "Add Team Member"}
                    </h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Assign a verified user to this division.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* USER SELECTION with AnimatedSelect */}
                <div className="space-y-2">
                    <AnimatedSelect
                        label="Select Candidate"
                        placeholder="Search all unassigned users..."
                        icon={UserPlus}
                        options={candidateOptions}
                        value={selectedUser}
                        onChange={setSelectedUser}
                    />
                    {filteredUsers.length === 0 && !loading && (
                        <p className="text-[10px] text-rose-400 font-bold ml-1">No eligible {type}s available in the talent pool.</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* POSITION */}
                    <div className="space-y-2">
                        {type === "manager" ? (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Assigned Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                    <div className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-400 dark:text-slate-600 font-bold cursor-not-allowed text-sm">
                                        Manager
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <AnimatedSelect
                                label="Assigned Role"
                                placeholder="Select Level"
                                icon={Briefcase}
                                options={levelOptions}
                                value={position}
                                onChange={setPosition}
                            />
                        )}
                    </div>

                    {/* SALARY */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Monthly Package</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" size={18} />
                            <input
                                type="number"
                                placeholder="e.g. 45000"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm"
                    >
                        Abandon
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || !selectedUser || !salary || !position}
                        className={`flex-3 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl ${type === 'manager' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-100 dark:shadow-none' : 'bg-teal-600 hover:bg-teal-500 shadow-teal-100 dark:shadow-none'} disabled:opacity-50 disabled:active:scale-100`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                <span>Confirm Appointment</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default AssignUserModal;