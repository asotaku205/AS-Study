const mockLogs = [
  { id: "l1", time: "10:24:05", level: "ERROR", message: "Database connection timeout in module UserAuth", source: "AuthService" },
  { id: "l2", time: "10:22:12", level: "WARN", message: "High memory usage detected (85%)", source: "SystemMonitor" },
  { id: "l3", time: "10:15:00", level: "INFO", message: "Admin 'hoange' updated system settings", source: "AdminAPI" },
  { id: "l4", time: "09:45:30", level: "INFO", message: "Daily backup completed successfully", source: "BackupJob" },
  { id: "l5", time: "08:12:05", level: "ERROR", message: "Failed to parse PDF document ID: d125", source: "DocProcessor" },
  { id: "l6", time: "07:55:10", level: "WARN", message: "Rate limit exceeded for IP: 203.x.x.x", source: "RateLimiter" },
  { id: "l7", time: "07:30:00", level: "INFO", message: "User 'nguyena' upgraded to Premium plan", source: "PaymentService" },
];
export default mockLogs