import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthBanner from "../components/users/AuthBanner";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword,setIsShowPassword] = useState(false);
  const navigate = useNavigate();


  const schema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      toast.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthBanner
        typeAuth="Đăng nhập"
        desc="Chào mừng trở lại! Hãy tiếp tục hành trình học tập."
      />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  {...register("email")}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
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

                  {...register("password")}
                  className="appearance-none block w-full px-3 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
                  <button
                    type="button"
                    className="absolute right-3 inset-y-0 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-slate-900 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress aria-label="Loading…" size={20}  />
                ) : (
                  "Đăng nhập"
                )}
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
                  Chưa có tài khoản?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Đăng ký ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
