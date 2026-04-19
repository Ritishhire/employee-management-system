import { create } from "zustand";
import { axiosInstance } from "../../Axios/axios.js";
import toast from "react-hot-toast";
import { useAuthUserStore } from "./useAuthUserStore.js";

const getRoutePrefix = () => {
    const role = useAuthUserStore.getState().authUser?.role;
    if (role === "admin") return "/admin/department";
    if (role === "manager") return "/manager/department";
    if (role === "employee") return "/employee/department";
    return "/admin/department"; // default fallback
};

export const useDepartmentStore = create((set, get) => ({
    departments: [],
    selectedDepartment: null,
    isLoading: false,

    deleteDepartment: async (departmentId) => {
        const token = useAuthUserStore.getState().token;
        try {
            const res = await axiosInstance.delete(`/admin/department/deleteDepartment/${departmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(res.data.message || "Department deleted successfully");
            get().getDepartments();
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete department";
            toast.error(message);
            return false;
        }
    },

    removeDepartmentUser: async (departmentId, userId) => {
        const token = useAuthUserStore.getState().token;
        const prefix = getRoutePrefix();
        const role = useAuthUserStore.getState().authUser?.role;
        try {
            let res;
            if (role === "manager") {
                res = await axiosInstance.delete(`/manager/department/removeEmployee/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                res = await axiosInstance.put(`/admin/user/removeUserFromDepartment/${departmentId}/${userId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            toast.success(res.data.message || "User removed from department successfully");
            get().getDepartmentDetails(departmentId);
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to remove user from department";
            toast.error(message);
            return false;
        }
    },

    createEmployee: async (employeeData) => {
        const selectedDepartment = get().selectedDepartment;
        const token = useAuthUserStore.getState().token;
        const role = useAuthUserStore.getState().authUser?.role;
        const departmentId = selectedDepartment.department._id;
        
        try {
            let res;
            if (role === "manager") {
                // Manager uses special endpoint to add employee to their own department
                res = await axiosInstance.post(`/manager/department/addEmployee`, { employeeId: employeeData.userId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await axiosInstance.put(`/admin/user/assignDepartment/${departmentId}`, employeeData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            toast.success(res.data.message || "Employee added successfully");
            get().getDepartments();
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to add employee";
            toast.error(message);
            return false;
        }
    },

    updateDepartment: async (departmentId, updatedData) => {
        const token = useAuthUserStore.getState().token;
        const prefix = getRoutePrefix();
        try {
            const res = await axiosInstance.put(`${prefix}/updateDepartment/${departmentId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(res.data.message || "Department updated successfully");
            await get().getDepartmentDetails(departmentId);
            get().getDepartments();
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update department";
            toast.error(message);
            return false;
        }
    },

    getDepartmentDetails: async (departmentId) => {
        const token = useAuthUserStore.getState().token;
        const prefix = getRoutePrefix();
        try {
            // For managers and employees, the endpoint doesn't need an ID parameter
            const endpoint = (prefix === "/manager/department" || prefix === "/employee/department")
                ? `${prefix}/getDepartmentDetails`
                : `${prefix}/getDepartmentDetails/${departmentId}`;

            const res = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ selectedDepartment: res.data.data });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to get department details";
            toast.error(message);
            return false;
        }
    },

    addDepartment: async (departmentData) => {
        const token = useAuthUserStore.getState().token;
        try {
            const response = await axiosInstance.post("/admin/department/addDepartment", departmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message || "Department added successfully");
            get().getDepartments();
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create department";
            toast.error(message);
            return false;
        }
    },

    getDepartments: async () => {
        const token = useAuthUserStore.getState().token;
        const prefix = getRoutePrefix();
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`${prefix}/getDepartments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({
                departments: res.data.data.departments || res.data.data,
                isLoading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Failed to fetch",
                isLoading: false,
            });
        }
    },
}));