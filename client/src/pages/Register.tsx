import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import AuthBanner from "../components/users/AuthBanner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { register } from "../services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const schema = z
    .object({
      name: z.string().min(1, "Vui lòng nhập tên của bạn"),
      username: z.string().min(3, "Tối thiểu 3 ký tự"),
      password: z.string().min(6, "Tối thiểu 6 ký tự"),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleRegister = async (data: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await register(data.name, data.username, data.password);
      navigate("/login");
      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthBanner
        typeAuth="Đăng ký"
        desc="Tạo tài khoản mới để bắt đầu hành trình học tập của bạn."
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Họ và tên
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...registerField("name")}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="Tên của bạn"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tên đăng nhập
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...registerField("username")}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="tên đăng nhập"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  type={isShowPassword ? "text" : "password"}
                  {...registerField("password")}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="Mật khẩu của bạn"
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nhập lại mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  type={isShowConfirmPassword ? "text" : "password"}
                  {...registerField("confirmPassword")}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                >
                  {isShowConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                {isLoading ? (
                  <CircularProgress aria-label="Loading…" size={20} />
                ) : (
                  "Đăng ký tài khoản"
                )}
              </button>
               <button
              type="button"
              className="w-full mt-4 inline-flex justify-center items-center py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-white dark:text-slate-300 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={() =>  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            >
              Đăng ký với Google
            </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                  Đã có tài khoản?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Đăng nhập ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
