import { useAuthUserStore } from "../src/Store/useAuthUserStore";
import {
    LayoutDashboard,
    Users,
    Building2,
    User,
    LogOut,
    X,
    Sun,
    Moon,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const SideBar = () => {
    const { t } = useTranslation();
    const { authUser, activeSection, logout, toggleMobileSidebar, theme, toggleTheme } = useAuthUserStore();
    const role = authUser?.role;

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const menuItems = [
        { name: "Dashboard", translationKey: "common.dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "employee"] },
        { name: "Users", translationKey: "common.users", icon: Users, roles: ["admin"] },
        { name: "Departments", translationKey: "common.departments", icon: Building2, roles: ["admin", "manager", "employee"] },
        { name: "Attendance", translationKey: "common.attendance", icon: Clock, roles: ["admin", "manager", "employee"] },
        { name: "Profile", translationKey: "common.profile", icon: User, roles: ["admin", "manager", "employee"] },
    ];

    const MenuItem = ({ item }) => {
        const isActive = activeSection === item.name.toLowerCase();
        const Icon = item.icon;

        return (
            <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    useAuthUserStore.setState({
                        activeSection: item.name.toLowerCase(),
                    });
                    toggleMobileSidebar(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
        ${isActive
                        ? "text-teal-400"
                        : "text-slate-400 hover:text-white"
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-teal-600/10 border-l-4 border-teal-500 shadow-inner"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                
                <Icon className={`size-5 relative z-10 ${isActive ? "text-teal-400" : "group-hover:text-white"}`} />
                <span className="text-sm font-medium relative z-10">{t(item.translationKey)}</span>
            </motion.button>
        );
    };

    return (
        <div className="h-screen w-64 backdrop-blur-xl bg-gray-900 border-r border-white/10 text-white flex flex-col transition-colors">

            {/* HEADER */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <h1 className="text-xl font-bold tracking-wide">EMS</h1>
                    <p className="text-xs text-slate-400 capitalize mt-1">{role}</p>
                </motion.div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleMobileSidebar(false)}
                    className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                    <X size={20} />
                </motion.button>
            </div>

            {/* USER INFO */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-5 border-b border-white/10 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {authUser?.name?.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold">{authUser?.name}</p>
                    <p className="text-xs text-slate-400">{authUser?.email}</p>
                </div>
            </motion.div>

            {/* MENU */}
            <div className="flex-1 p-4 space-y-2">
                {menuItems
                    .filter((item) => item.roles.includes(role))
                    .map((item, index) => (
                        <MenuItem key={index} item={item} />
                    ))}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-white/10 space-y-3">

                {/* LANGUAGE SELECTOR */}
                <LanguageSelector />

                {/* THEME TOGGLE */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-all shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {theme === 'light' ? (
                            <motion.div
                                key="moon"
                                initial={{ rotate: -40, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 40, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Moon className="size-4" />
                                <span>{t('common.darkMode')}</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ rotate: 40, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -40, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Sun className="size-4" />
                                <span>{t('common.lightMode')}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-500 text-white py-2 rounded-xl text-sm transition-all shadow-lg shadow-red-500/10"
                >
                    <LogOut className="size-4" />
                    {t('common.logout')}
                </motion.button>

            </div>
        </div>
    );
};

export default SideBar;