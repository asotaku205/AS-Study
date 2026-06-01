import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";
import { getUserProfile } from "../services/userService";
import CircularProgress from "@mui/material/CircularProgress";

interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
}

const SetupUsername = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
        setUsername(data.username || "");
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast.error("Không thể tải thông tin tài khoản");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    
    if (!cleanUsername) {
      toast.error("Tên đăng nhập không được để trống");
      return;
    }

    if (cleanUsername.length < 3) {
      toast.error("Tên đăng nhập phải có ít nhất 3 ký tự");
      return;
    }

    if (!/^[a-z0-9._-]+$/.test(cleanUsername)) {
      toast.error("Tên đăng nhập chỉ được chứa chữ thường, số, dấu chấm, gạch ngang và gạch dưới");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/users/${userProfile?.id}`, {
        username: cleanUsername,
      });
      toast.success("Thiết lập tên đăng nhập thành công!");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message[0] : message || "Tên đăng nhập đã được sử dụng hoặc không hợp lệ");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <CircularProgress className="text-slate-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chào mừng bạn đến với AS-Study!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bạn đã đăng nhập bằng Google. Hãy chọn một tên đăng nhập (username) cho tài khoản của bạn để dễ dàng đăng nhập và tương tác.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên đăng nhập (username)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full pl-8 pr-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white text-sm"
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Chỉ sử dụng chữ thường, số, dấu chấm, gạch ngang và gạch dưới. Tối thiểu 3 ký tự.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-60"
          >
            {isSaving ? (
              <CircularProgress size={16} />
            ) : (
              <>
                Hoàn tất đăng ký
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupUsername;
