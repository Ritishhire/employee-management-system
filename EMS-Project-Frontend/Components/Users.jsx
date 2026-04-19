import { useEffect, useState, useMemo } from "react";
import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import UpdateUserModal from "../Modals/UpdateUserModal.jsx";
import AddUserModal from "../Modals/addUser.Modal.jsx";
import DeleteUserModal from "../Modals/DeleteUser.Modal.jsx";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
    Search, 
    UserPlus, 
    Edit3, 
    Trash2, 
    Users as UsersIcon, 
    CheckCircle2, 
    XCircle,
    DollarSign,
    ChevronDown,
    Mail,
    Shield,
    Briefcase
} from "lucide-react";

const Users = () => {
    const { t } = useTranslation();
    const { users, getUsers, deleteUser, authUser } = useAuthUserStore();
    const activeSection = useAuthUserStore((state) => state.activeSection);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        if (!users || users.length === 0 || activeSection === "users") {
            getUsers();
        }
    }, [getUsers, activeSection]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleDelete = async () => {
        const success = await deleteUser(selectedUser._id);
        if (success) {
            setIsDeleteModalOpen(false);
        }
    };

    const getInitials = (userName) => {
        return (userName || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const getAvatarBg = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            case 'manager': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            default: return 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-700';
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            case 'manager': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            default: return 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700';
        }
    };

    /* ========== MOBILE CARD ========== */
    const UserCard = ({ user }) => {
        const isExpanded = expandedUserId === user._id;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
            >
                {/* Card Header — always visible */}
                <motion.button
                    whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    onClick={() => setExpandedUserId(isExpanded ? null : user._id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                >
                    <div className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-2xl border font-bold text-sm shadow-sm ${getAvatarBg(user.role)}`}>
                        {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{user.name}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 truncate">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                            {user.role}
                        </span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                        >
                            <ChevronDown size={16} className="text-slate-400" />
                        </motion.div>
                    </div>
                </motion.button>

                {/* Expanded Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3">
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Shield size={14} className="text-slate-400" />
                                        <span className="text-slate-500 dark:text-slate-400">Role:</span>
                                        <span className="font-bold text-slate-800 dark:text-white capitalize">{user.role}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <span className={`font-bold text-sm ${user.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {user.isActive ? t('users.active') : t('users.inactive')}
                                        </span>
                                    </div>
                                    {authUser?.role === "admin" && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign size={14} className="text-slate-400" />
                                            <span className="text-slate-500 dark:text-slate-400">Pay:</span>
                                            <span className="font-bold text-slate-800 dark:text-white">
                                                {user.role !== 'admin' ? `$${(user.salary || 0).toLocaleString()}` : 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="text-slate-500 dark:text-slate-400">Employee:</span>
                                        <span className="font-bold">
                                            {user.isEmployee
                                                ? <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
                                                : <XCircle size={16} className="text-slate-300 dark:text-slate-600" />}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-sm"
                                    >
                                        <Edit3 size={15} /> {t('common.edit')}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all shadow-sm"
                                    >
                                        <Trash2 size={15} /> {t('common.delete')}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="flex-1 flex flex-col min-h-full items-center p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">

            <div className="w-full max-w-6xl space-y-6 sm:space-y-8">

                {/* HEADER SECTION */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <motion.div 
                                whileHover={{ rotate: 10 }}
                                className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/40"
                            >
                                <UsersIcon size={24} />
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{t('users.title')}</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:mt-1.5 select-none">{t('users.subtitle')}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {/* SEARCH BAR */}
                        <div className="relative group flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={t('users.searchPlaceholder')}
                                className="w-full text-black dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
                        >
                            <UserPlus size={20} />
                            <span className="hidden sm:inline">{t('users.addUser')}</span>
                            <span className="sm:hidden">{t('common.add')}</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* CONTENT AREA WITH LAYOUT GROUP FOR SMOOTH REORDERING */}
                <LayoutGroup>
                    {/* MOBILE CARD VIEW (< lg) */}
                    <motion.div layout className="lg:hidden space-y-3">
                        <AnimatePresence mode="popLayout">
                            {(!filteredUsers || filteredUsers.length === 0) ? (
                                <motion.div 
                                    key="no-results"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-12 text-center flex flex-col items-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 mb-4">
                                        <Search size={36} />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('users.noResults')}</p>
                                    <button onClick={() => setSearchTerm("")} className="text-teal-600 dark:text-teal-400 font-bold mt-2 hover:underline">{t('common.clearSearch')}</button>
                                </motion.div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <UserCard key={user._id} user={user} />
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* DESKTOP TABLE (>= lg) */}
                    <motion.div layout className="hidden lg:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        
                        <div className="overflow-x-auto">
                            <AnimatePresence mode="wait">
                                {(!filteredUsers || filteredUsers.length === 0) ? (
                                    <motion.div 
                                        key="no-results-desktop"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-20 text-center flex flex-col items-center"
                                    >
                                        <div className="p-6 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 mb-4">
                                            <Search size={48} />
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No results found matching your search criteria.</p>
                                        <button onClick={() => setSearchTerm("")} className="text-teal-600 dark:text-teal-400 font-bold mt-2 hover:underline">Clear Search</button>
                                    </motion.div>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('users.userInfo')}</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('users.role')}</th>
                                                {authUser?.role === "admin" && (
                                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('users.pay')}</th>
                                                )}
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('users.status')}</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('users.isEmployee')}</th>
                                                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.actions')}</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                            <AnimatePresence>
                                                {filteredUsers.map((user) => (
                                                    <motion.tr 
                                                        layout
                                                        key={user._id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group"
                                                    >
                                                        
                                                        {/* USER INFO */}
                                                        <td className="px-8 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-11 h-11 flex items-center justify-center rounded-2xl border font-bold text-sm shadow-sm transition-transform group-hover:scale-105 ${getAvatarBg(user.role)}`}>
                                                                    {getInitials(user.name)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{user.name}</div>
                                                                    <div className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* ROLE BADGE */}
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${getRoleBadge(user.role)}`}>
                                                                {user.role}
                                                            </span>
                                                        </td>

                                                        {/* SALARY */}
                                                        {authUser?.role === "admin" && (
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold text-sm">
                                                                    <DollarSign size={14} className="text-slate-400" />
                                                                    {user.role !== 'admin' ? (user.salary || 0).toLocaleString() : <span className="text-slate-300 dark:text-slate-600 font-normal">N/A</span>}
                                                                </div>
                                                            </td>
                                                        )}

                                                        {/* STATUS */}
                                                        <td className="px-6 py-4">
                                                            <div className={`flex items-center gap-2 text-xs font-bold border w-fit px-3 py-1.5 rounded-full shadow-sm
                                                                ${user.isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-700" : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-700"}`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                                                                {user.isActive ? t('users.active').toUpperCase() : t('users.inactive').toUpperCase()}
                                                            </div>
                                                        </td>

                                                        {/* IS EMPLOYEE */}
                                                        <td className="px-6 py-4">
                                                            <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${user.isEmployee ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-600"}`}>
                                                                {user.isEmployee ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                            </div>
                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td className="px-4 sm:px-8 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-sm"
                                                                    title="Edit User"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setIsDeleteModalOpen(true);
                                                                    }}
                                                                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all shadow-sm"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </motion.button>
                                                            </div>
                                                        </td>

                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </LayoutGroup>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {isModalOpen && (
                    <UpdateUserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        user={selectedUser}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModalOpen && (
                    <AddUserModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <DeleteUserModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                        user={selectedUser}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
