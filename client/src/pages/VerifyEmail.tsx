import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import AuthBanner from "../components/users/AuthBanner";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../services/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Mã xác thực email không hợp lệ.");
      return;
    }

    const performVerification = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        const msg = err.response?.data?.message;
        setErrorMessage(Array.isArray(msg) ? msg[0] : msg || "Xác thực email thất bại. Token có thể đã hết hạn.");
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <AuthBanner
        typeAuth="Xác thực Email"
        desc="Hệ thống đang kiểm tra thông tin để xác thực hòm thư của bạn."
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10 text-center">
          {status === "loading" && (
            <div className="space-y-4 py-6">
              <CircularProgress size={40} className="text-slate-900 dark:text-white" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Đang xác thực tài khoản của bạn, vui lòng đợi...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 py-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Xác thực thành công!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Email của bạn đã được xác thực thành công. Bạn đã có thể sử dụng đầy đủ các tính năng bao gồm Quên mật khẩu.
              </p>
              <Link
                to="/login"
                className="w-full mt-4 inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-4">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Xác thực thất bại</h3>
              <p className="text-sm text-red-500 dark:text-red-400 font-medium">
                {errorMessage}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hãy đảm bảo bạn nhấn đúng đường dẫn trong email xác thực đã nhận.
              </p>
              <Link
                to="/login"
                className="w-full mt-4 inline-flex justify-center items-center gap-2 py-2.5 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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

export default VerifyEmail;
