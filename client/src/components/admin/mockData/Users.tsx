export type UserStatus = "Active" | "Banned";
export type UserRole = "Free" | "Premium" | "Admin";
export interface User {
  id: string; name: string; email: string;
  role: UserRole; status: UserStatus; date: string;
}
const initialUsers: User[] = [
  { id: "u1", name: "Nguyễn Văn A", email: "nguyena@example.com", role: "Premium", status: "Active", date: "Vừa xong" },
  { id: "u2", name: "Trần Thị B", email: "tranb@example.com", role: "Free", status: "Active", date: "10 phút trước" },
  { id: "u3", name: "Lê Quang C", email: "lequangc@example.com", role: "Free", status: "Banned", date: "1 giờ trước" },
  { id: "u4", name: "Phạm D", email: "phamd@example.com", role: "Premium", status: "Active", date: "3 giờ trước" },
  { id: "u5", name: "Hoàng Văn E", email: "hoange@example.com", role: "Admin", status: "Active", date: "Hôm qua" },
  { id: "u6", name: "Đỗ Thị F", email: "dothif@example.com", role: "Free", status: "Active", date: "2 ngày trước" },
  { id: "u7", name: "Vũ Văn G", email: "vuvang@example.com", role: "Premium", status: "Active", date: "3 ngày trước" },
  { id: "u8", name: "Bùi Thị H", email: "buithih@example.com", role: "Free", status: "Active", date: "5 ngày trước" },
  { id: "u9", name: "Dương Văn I", email: "duongvani@example.com", role: "Free", status: "Banned", date: "1 tuần trước" },
  { id: "u10", name: "Ngô Thị K", email: "ngothik@example.com", role: "Premium", status: "Active", date: "1 tuần trước" },
];
export default initialUsers