import { create } from "zustand";
import { axiosInstance } from "../../Axios/axios.js";
import toast from "react-hot-toast";
import { useAuthUserStore } from "./useAuthUserStore";

export const useAttendanceStore = create((set, get) => ({
  attendanceRecords: [],
  currentDayRecord: null,
  isLoading: false,

  punch: async () => {
    set({ isLoading: true });
    try {
      const token = useAuthUserStore.getState().token;
      const res = await axiosInstance.post("/attendance/punch", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(res.data.message);
      set({ currentDayRecord: res.data.record });
      
      // Refresh statistics/history if needed
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Punch action failed";
      toast.error(message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyAttendance: async (month, year) => {
    set({ isLoading: true });
    try {
      const token = useAuthUserStore.getState().token;
      const res = await axiosInstance.get(`/attendance/me?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ attendanceRecords: res.data });
      
      // Also update currentDayRecord if it exists in the fetched list
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const todayRecord = res.data.find(r => new Date(r.date).getTime() === today.getTime());
      set({ currentDayRecord: todayRecord || null });

    } catch (error) {
      console.error("Fetch attendance failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getDepartmentAttendance: async (departmentId, date) => {
    try {
      const token = useAuthUserStore.getState().token;
      const res = await axiosInstance.get(`/attendance/department?departmentId=${departmentId}&date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Fetch department attendance failed:", error);
      return [];
    }
  },

  getAllAttendance: async (date) => {
    try {
      const token = useAuthUserStore.getState().token;
      const res = await axiosInstance.get(`/attendance/all?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error("Fetch all attendance failed:", error);
      return [];
    }
  }
}));
