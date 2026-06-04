import api from "./api";
export const getUserProfile = async () => {
    try {
        const res = await api.get("/auth/profile");
        return res.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}
export const getAllUsers = async () => {
    const res = await api.get("/users/all");
    return res.data;
}

export const banUser = async (id: number) => {
    const res = await api.patch(`/users/${id}/ban`);
    return res.data;
}
export const unbanUser = async (id: number) => {
    const res = await api.patch(`/users/${id}/unban`);
    return res.data;
}
export const getUserRegistrationGrowth = async () => {
    const res = await api.get("/users/stats/registration-growth");
    return res.data;
}
export const getDashboardChart = async () => {
  const res = await api.get("/users/chart");
  return res.data;
};