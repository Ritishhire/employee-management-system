import { create } from "zustand";
import { axiosInstance } from "../../Axios/axios.js";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";


export const useAuthUserStore = create((set,get) => ({
    authUser: localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null,
    token: localStorage.getItem('token') || null,
    users:[],
    activeSection: "dashboard",
    isMobileSidebarOpen: false,
    theme: localStorage.getItem('ems-theme') || 'light',

    toggleMobileSidebar: (isOpen) => set({ isMobileSidebarOpen: isOpen }),

    toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('ems-theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
    },


    getemployees:async()=>{
        try {
            const token = get().token; // Get the token from the store    
            const res = await axiosInstance.get("/admin/employee/getEmployees",{
                headers: {
                     Authorization: `Bearer ${token}`
                }
            });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to get users";
            toast.error(message);
            return false;
        }
    },



    deleteUser: async (userId) => {
        try {

            //before deletin ask for confirmation using toast
            const token = get().token;

            const res = await axiosInstance.delete(
                `/admin/user/deleteUser/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message || "User deleted");

            // refresh list
            get().getUsers();

            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete user";
            toast.error(message);
            return false;
        }
    },


    addUser: async (formData) => {
        try {
            const token = get().token;

            const res = await axiosInstance.post(
                "/admin/user/addUser",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message || "User created");

            // refresh list
            get().getUsers();

            return true;

        } catch (error) {
            const message = error.response?.data?.message || "Failed to create user";
            toast.error(message);
            return false;
        }
    },




    updateUser: async (userId, formData) => {
        try {
            const token = get().token;

            const res = await axiosInstance.put(
                `/admin/user/updateUser/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message || "User updated");

            // 🔥 refresh users list
            get().getUsers();

            return true;

        } catch (error) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return false;
        }
    },


    getUsers: async () => {
        try {
            const token = get().token;
            const role = get().authUser?.role;
            let endpoint = "/admin/user/getUsers";
            
            if (role === "manager") {
                endpoint = "/manager/user/getUnassignedUsers";
            }
            
            const res = await axiosInstance.get(endpoint, {
                headers: { 
                   Authorization: `Bearer ${token}`
                }
            });
            set({ users: res.data.data });
        } catch (error) {
            console.log("Error fetching users:", error);
            toast.error("Failed to fetch users");
        }
    },


    //login function
    login: async (formData) => {
        try {
            const res = await axiosInstance.post("/auth/login", formData);

            toast.success("Login successful!");

            set({
                token: res.data.data.token,
                authUser: res.data.data.user
            });

            localStorage.setItem('authUser', JSON.stringify(res.data.data.user));
            localStorage.setItem('token', res.data.data.token);

            return true;

        } catch (error) {

            // 🔥 THIS is where 401/404/403 comes
            const message = error.response?.data?.message || "Login failed";

            toast.error(message);

            return false;
        }
    },

  logout: () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    set({ authUser: null, token: null });
  },

  getProfile: async () => {
    try {
        const token = get().token;
        const res = await axiosInstance.get("/auth/getProfile", {
            headers: { Authorization: `Bearer ${token}` }
        });
        set({ authUser: res.data.data });
        // Update local storage too
        localStorage.setItem('authUser', JSON.stringify(res.data.data));
        return res.data.data;
    } catch (error) {
        toast.error("Failed to load profile");
        return null;
    }
  }

}))