import api, { setAccessToken } from "./api";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.access_token;
    setAccessToken(token);
    const profileResponse = await api.get("/auth/profile");
    const userRole = profileResponse.data.role;
    localStorage.setItem("user_role", userRole);
    return profileResponse.data;
  } catch (error) {
    throw error;
  }
}
export const getRole = () => {
  return localStorage.getItem("user_role");
};

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
    localStorage.removeItem("user_role");
  }
}

export const register = async (name: string, email: string, password: string) => {
    try {
        const res = await api.post("/users/register", { name, email, password });
        return res.data;
    } catch (error) {
        throw error;
    }
}