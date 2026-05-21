import { useState, useEffect } from "react";
import { getAllUsers, getUserProfile } from "../services/userService";
import type { User } from "../types/userTypes";

const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    let isActive = true;
    const loadUser = async () => {
      try {
        const data = await getUserProfile();
        if (isActive) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    const loadUsers = async () => {
      try {
        const res = await getAllUsers();
        if (isActive) {
          setUsers(res);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUser();
    loadUsers();
    return () => {
      isActive = false;
    };
  }, []);
  return { user, users, setUsers };
};
export default useGetUser;