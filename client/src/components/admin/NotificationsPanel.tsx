import { useRef, useMemo } from "react";
import { Bell, ExternalLink } from "lucide-react";
import type { Doc } from "./mockData/Docs";
import mockLogs from "./mockData/Logs";
import { Clock, AlertTriangle, AlertCircle } from "lucide-react";

interface NotificationsPanelProps {
  docs: Doc[];
  showNotifPanel: boolean;
  setShowNotifPanel: (value: boolean) => void;
  readNotifIds: Set<string>;
  setReadNotifIds: (value: Set<string>) => void;
  onNotificationAction: (tabName: string, statusFilter?: string) => void;
}

type NotifType = "error" | "warn" | "info";
type Notif = {
  id: string;
  type: NotifType;
  icon: React.ElementType;
  title: string;
  desc: string;
  time: string;
  action: () => void;
};

const NotificationsPanel = ({
  docs,
  showNotifPanel,
  setShowNotifPanel,
  readNotifIds,
  setReadNotifIds,
  onNotificationAction,
}: NotificationsPanelProps) => {
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = useMemo(() => {
    const list: Notif[] = [];
    docs
      .filter((d) => d.status === "Pending")
      .forEach((d) => {
        list.push({
          id: `pending-${d.id}`,
          type: "warn",
          icon: Clock,
          title: "Tài liệu chờ duyệt",
          desc: d.title,
          time: "Vừa xong",
          action: () => onNotificationAction("documents", "Pending"),
        });
      });
    docs
      .filter((d) => d.status === "Reported")
      .forEach((d) => {
        list.push({
          id: `reported-${d.id}`,
          type: "error",
          icon: AlertTriangle,
          title: "Vi phạm bị báo cáo",
          desc: d.title,
          time: "Mới nhất",
          action: () => onNotificationAction("documents", "Reported"),
        });
      });
    mockLogs
      .filter((l) => l.level === "ERROR")
      .slice(0, 2)
      .forEach((l) => {
        list.push({
          id: `log-${l.id}`,
          type: "error",
          icon: AlertCircle,
          title: "Lỗi hệ thống",
          desc: l.message,
          time: l.time,
          action: () => onNotificationAction("reports"),
        });
      });
    mockLogs
      .filter((l) => l.level === "WARN")
      .slice(0, 1)
      .forEach((l) => {
        list.push({
          id: `warn-${l.id}`,
          type: "warn",
          icon: AlertTriangle,
          title: "Cảnh báo hệ thống",
          desc: l.message,
          time: l.time,
          action: () => onNotificationAction("reports"),
        });
      });
    return list;
  }, [docs, onNotificationAction]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readNotifIds.has(n.id)).length,
    [notifications, readNotifIds],
  );

  return (
    <div ref={notifRef} className="relative">
      <button
        onClick={() => setShowNotifPanel(!showNotifPanel)}
        className={`relative p-2.5 rounded-xl transition-colors ${showNotifPanel ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifPanel && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Thông báo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : "Tất cả đã đọc"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  const allReadIds = new Set<string>(notifications.map((n) => n.id));
                  setReadNotifIds(allReadIds);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-9 h-9 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">
                  Không có thông báo nào
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isRead = readNotifIds.has(notif.id);
                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      notif.action();
                      const newReadIds = new Set(readNotifIds);
                      newReadIds.add(notif.id);
                      setReadNotifIds(newReadIds);
                      setShowNotifPanel(false);
                    }}
                    className={`w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left ${isRead ? "opacity-55" : ""}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notif.type === "error" ? "bg-red-50 dark:bg-red-900/20" : notif.type === "warn" ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      <notif.icon
                        className={`w-4 h-4 ${notif.type === "error" ? "text-red-600 dark:text-red-400" : notif.type === "warn" ? "text-yellow-600 dark:text-yellow-400" : "text-slate-600 dark:text-slate-400"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {notif.title}
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {notif.desc}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                        {notif.time}
                      </p>
                    </div>
                    {!isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
            <button
              onClick={() => {
                onNotificationAction("reports");
                setShowNotifPanel(false);
              }}
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              Xem toàn bộ trong Báo cáo hệ thống{" "}
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
