export type DocStatus = "Published" | "Pending" | "Reported" | "Rejected";

export interface Doc {
  id: string; title: string; category: string; author: string;
  status: DocStatus; views: number; date: string;
}
const initialDocs: Doc[] = [
  { id: "d1", title: "Cấu trúc dữ liệu và Giải thuật", category: "CNTT", author: "Nguyễn Văn A", status: "Published", views: 1240, date: "12/10/2023" },
  { id: "d2", title: "Giải tích 2 - Đề cương chi tiết", category: "Toán học", author: "Lê Quang C", status: "Pending", views: 0, date: "14/10/2023" },
  { id: "d3", title: "Tâm lý học Đại cương", category: "Tâm lý", author: "Trần Thị B", status: "Published", views: 856, date: "15/10/2023" },
  { id: "d4", title: "Kinh tế vĩ mô 2024", category: "Kinh tế", author: "Phạm D", status: "Reported", views: 3210, date: "18/10/2023" },
  { id: "d5", title: "Lập trình ReactJS cơ bản", category: "CNTT", author: "Hoàng Văn E", status: "Published", views: 5600, date: "20/10/2023" },
  { id: "d6", title: "Hóa học hữu cơ phần 1", category: "Khoa học", author: "Vũ Văn G", status: "Pending", views: 0, date: "22/10/2023" },
  { id: "d7", title: "Lịch sử Việt Nam hiện đại", category: "Lịch sử", author: "Đỗ Thị F", status: "Published", views: 420, date: "25/10/2023" },
  { id: "d8", title: "Triết học Mác - Lênin", category: "Triết học", author: "Bùi Thị H", status: "Reported", views: 780, date: "28/10/2023" },
];
export default initialDocs 