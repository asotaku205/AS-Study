import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import AuthBanner from "../components/users/AuthBanner";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const schema = z.object({
    username: z.string().min(3, "Username tối thiểu 3 ký tự"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleForgotPassword = async (data: { username: string }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { username: data.username });
      setIsSent(true);
      toast.success("Nếu tài khoản có email đã xác thực, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu!");
    } catch (err: any) {
      const message = err.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message[0] : message || "Yêu cầu khôi phục mật khẩu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <AuthBanner
        typeAuth="Quên mật khẩu"
        desc="Nhập username của bạn để nhận liên kết đặt lại mật khẩu qua email đã liên kết."
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {!isSent ? (
            <form className="space-y-6" onSubmit={handleSubmit(handleForgotPassword)}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tên đăng nhập
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register("username")}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 sm:text-sm transition-colors"
                    placeholder="Tên đăng nhập"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.username.message}
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
                    "Gửi email khôi phục"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email khôi phục đã được gửi</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Vui lòng kiểm tra hộp thư của email liên kết với tài khoản này để tiếp tục thiết lập lại mật khẩu.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-sm font-semibold text-slate-900 dark:text-white hover:underline mt-2"
              >
                Gửi lại yêu cầu khác
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
            <Link
              to="/login"
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
