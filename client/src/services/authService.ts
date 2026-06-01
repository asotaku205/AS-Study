import api, { setAccessToken } from "./api";

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { username, password });
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

export const register = async (
  name: string,
  username: string,
  password: string,
  email?: string | null,
) => {
    try {
        const res = await api.post("/users/register", {
          name,
          username,
          password,
          email: email || null,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}