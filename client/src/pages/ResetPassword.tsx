import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthBanner from "../components/users/AuthBanner";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const schema = z
    .object({
      password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleResetPassword = async (data: { password: string }) => {
    if (!token) {
      toast.error("Token khôi phục mật khẩu không tồn tại.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.password,
      });
      setIsSuccess(true);
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message[0] : message || "Đặt lại mật khẩu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Token không hợp lệ</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Liên kết khôi phục mật khẩu này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một liên kết mới.
            </p>
            <Link
              to="/forgot-password"
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Yêu cầu liên kết mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <AuthBanner
        typeAuth="Đặt lại mật khẩu"
        desc="Thiết lập mật khẩu mới cho tài khoản của bạn để tiếp tục sử dụng dịch vụ."
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {!isSuccess ? (
            <form className="space-y-6" onSubmit={handleSubmit(handleResetPassword)}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mật khẩu mới
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
                  Xác nhận mật khẩu mới
                </label>
                <div className="mt-1 relative">
                  <input
                    type={isShowConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="appearance-none block w-full px-3 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                    placeholder="••••••••"
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
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} className="text-white dark:text-slate-900" />
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Đặt lại thành công!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mật khẩu của bạn đã được thay đổi thành công. Hãy quay lại trang Đăng nhập để truy cập tài khoản.
              </p>
              <Link
                to="/login"
                className="w-full mt-4 inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {!isSuccess && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
