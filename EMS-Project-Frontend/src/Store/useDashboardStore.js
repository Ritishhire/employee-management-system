import { create } from "zustand";
import { axiosInstance } from "../../Axios/axios.js";
import { useAuthUserStore } from "./useAuthUserStore";
import toast from "react-hot-toast";

export const useDashboardStore = create((set, get) => ({
    stats: null,
    isLoading: false,
    error: null,

    getStats: async () => {
        const role = useAuthUserStore.getState().authUser?.role;
        const token = useAuthUserStore.getState().token;
        
        if (!role || !token) return;

        set({ isLoading: true, error: null });
        
        try {
            let prefix = "";
            if (role === "admin") prefix = "/admin/dashboard";
            else if (role === "manager") prefix = "/manager/dashboard";
            else {
                // For Employees, we don't have a separate dashboard endpoint yet, 
                // but we can just use the authUser details which are usually sufficient.
                set({ isLoading: false });
                return;
            }

            const res = await axiosInstance.get(`${prefix}/getStats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ stats: res.data.data, isLoading: false });
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            set({ 
                error: err.response?.data?.message || "Failed to fetch dashboard data", 
                isLoading: false 
            });
            toast.error("Failed to load dashboard statistics");
        }
    }
}));
