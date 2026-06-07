# AS-Study - Hỗ Trợ Học Tập Thông Minh Bằng AI & OCR

**AS-Study** là một ứng dụng web hỗ trợ học tập thông minh tích hợp trí tuệ nhân tạo (Generative AI) và nhận dạng ký tự quang học (OCR). Hệ thống cho phép người dùng tải lên đa dạng các loại tài liệu học tập, tự động trích xuất nội dung văn bản, tương tác trò chuyện hỏi đáp trực quan cùng tài liệu, tự động biên soạn bài học chi tiết và thiết lập các bộ câu hỏi trắc nghiệm kiểm tra năng lực cá nhân hóa theo thang Bloom's Taxonomy.

---

## 🌟 Tính năng nổi bật

### 1. Trích xuất văn bản & OCR đa định dạng
*   Hỗ trợ tải lên: **PDF, Word (`.docx`), Excel (`.xlsx`, `.xls`), Text (`.txt`, `.md`, `.csv`) và hình ảnh (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`)**.
*   **Trích xuất thông minh**: 
    *   Tự động trích xuất trực tiếp thông qua cấu trúc file (Text Layer) với PDF, Word, Excel và Text.
    *   Tự động kích hoạt công cụ **Tesseract OCR (tiếng Việt & tiếng Anh)** đối với hình ảnh hoặc PDF dạng scan (không có lớp văn bản thô).
    *   Sử dụng **Tesseract Worker dùng chung** để tăng tốc độ quét song song nhiều trang và tránh quá tải bộ nhớ RAM hệ thống.

### 2. Trò chuyện tương tác với tài liệu (AI Chatbot)
*   Sử dụng **Google Gemini API** làm nền tảng trí tuệ nhân tạo.
*   **Cơ chế RAG (Retrieval-Augmented Generation)**: AI chỉ trả lời các thắc mắc bằng cách dựa *chính xác và nghiêm ngặt* vào nội dung ngữ cảnh của tài liệu người dùng tải lên.
*   **Streaming Response (SSE)**: Phản hồi của AI truyền về giao diện theo thời gian thực dưới dạng luồng ký tự (Server-Sent Events).
*   **Mô hình dự phòng (Fallback Model)**: Tự động chuyển đổi giữa `gemini-3.1-flash-lite`, `gemini-2.5-flash-lite`, `gemini-2.5-flash` khi gặp lỗi nghẽn hoặc đạt hạn mức cuộc gọi (Rate Limit).

### 3. Tự động sinh câu hỏi trắc nghiệm (Quiz Generator)
*   AI tự động phân tích sâu tài liệu nguồn để tạo ra bộ đề thi trắc nghiệm khách quan gồm 4 đáp án (A, B, C, D) với số câu hỏi tùy chọn.
*   **Tùy chọn độ khó theo thang đo Bloom**:
    *   *Basic (Nhận biết)*: Hỏi về định nghĩa, khái niệm cốt lõi.
    *   *Advanced (Thông hiểu & Áp dụng)*: So sánh, phân tích tình huống thực tế cơ bản.
    *   *Expert (Vận dụng cao & Đánh giá)*: Đặt vào case-study phức tạp, tìm lỗi sai, so sánh giải pháp.
*   Giải thích đáp án (Explanation) chi tiết 3 phần: Định nghĩa thuật ngữ + Giải thích lý do đúng/sai của từng lựa chọn + Ví dụ thực tế hoặc mẹo ghi nhớ.

### 4. Tự động biên soạn bài giảng chi tiết (Lecture Generator)
*   Chuyển hóa tài liệu thô thành bài học học thuật chi tiết ở trình độ Đại học theo 3 chế độ học tập:
    *   *Summary Mode*: Ghi nhớ nhanh, tập trung bullet-points và bảng tổng hợp.
    *   *Practical Mode*: Tập trung thực hành, case-study, lỗi thường gặp (common mistakes) và mẹo thực tế.
    *   *Deep Learning Mode*: Phân tích nguồn gốc lịch sử, so sánh đối chiếu sâu và tư duy phản biện.

### 5. Thư viện tài liệu & Bảng quản trị (Dashboard)
*   **Thư viện**: Hỗ trợ thư viện công khai (yêu cầu kiểm duyệt của Admin) và thư viện cá nhân của riêng từng người dùng.
*   **Trực quan hóa dữ liệu**: Sử dụng biểu đồ `Recharts` hiển thị biểu đồ phân bố điểm số, lịch sử làm bài thi, phân phối độ khó của các bài thi.
*   **Hệ thống quản trị**: Admin duyệt file công khai, quản lý người dùng, quản trị các danh mục môn học.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

*   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Material UI (MUI v9) & Emotion, Recharts, React Router DOM v7, React Hook Form & Zod, Lucide Icons, Sonner & React-Toastify.
*   **Backend**: NestJS v11, TypeORM, PostgreSQL, Passport (JWT Strategy & Google OAuth2 Strategy), Nodemailer & Mailer module.
*   **Bộ máy phân tích File & AI**: `@google/generative-ai` (Gemini SDK), `tesseract.js`, `pdf-parse`, `mammoth`, `xlsx`.

---

## 📁 Cấu trúc thư mục chi tiết (Directory Tree)

Dưới đây là sơ đồ cây cấu trúc mã nguồn đầy đủ của dự án (đã lược bỏ `node_modules` và thư mục build `dist`):

```text
AS-Study/
├── .env ───────────────────────────── Cấu hình môi trường toàn cục (PORT, DB, JWT, FRONTEND_URL)
├── .gitignore
├── README.md ──────────────────────── Tài liệu hướng dẫn dự án (File này)
│
├── client/ ────────────────────────── MÃ NGUỒN FRONTEND CLIENT (React)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx ───────────────── File khởi chạy React app
│       ├── App.tsx ────────────────── Định nghĩa cấu trúc routing các trang
│       ├── index.css ──────────────── Cài đặt Tailwind CSS v4 & Style toàn cục
│       │
│       ├── assets/ ────────────────── Thư mục chứa hình ảnh tĩnh, logo
│       │
│       ├── services/ ──────────────── Nơi gọi API REST lên Backend (Axios Client)
│       │   ├── api.ts ─────────────── Cấu hình Axios instance (base URL, interceptor chèn token)
│       │   ├── authService.ts ─────── Đăng nhập, đăng ký, quên mật khẩu
│       │   ├── documentService.ts ─── Upload, download tài liệu, gọi API chạy OCR
│       │   ├── chatService.ts ─────── Tạo phiên chat, tải tin nhắn lịch sử
│       │   ├── quizzService.ts ────── Lưu kết quả làm bài trắc nghiệm, lấy biểu đồ thống kê
│       │   ├── lectureService.ts ──── Lấy danh sách bài giảng học tập của cá nhân
│       │   └── userService.ts ─────── Cập nhật profile, đổi username
│       │
│       ├── pages/ ─────────────────── Giao diện của các trang chính
│       │   ├── HomePage.tsx ───────── Trang chủ sinh viên (Tổng hợp số liệu, tài liệu gần đây)
│       │   ├── Library.tsx ────────── Thư viện công cộng chứa tài liệu học tập dùng chung
│       │   ├── DocsDetail.tsx ────── Chi tiết tài liệu, khu vực quét OCR & tải xuống tài liệu
│       │   ├── PersonalLibrary.tsx ── Thư viện cá nhân chứa tài liệu của riêng mình
│       │   ├── UploadDoc.tsx ──────── Trang tải lên tài liệu mới
│       │   ├── ChatAI.tsx ────────── Màn hình trò chuyện thời gian thực cùng trợ lý AI Scholarly
│       │   ├── StudyMode.tsx ──────── Chế độ học tập (đọc bài giảng kết hợp chatbot đồng hành)
│       │   ├── QuizMode.tsx ──────── Giao diện làm bài trắc nghiệm tính giờ
│       │   ├── QuizResult.tsx ────── Giao diện hiển thị điểm thi và biểu đồ phân tích năng lực
│       │   ├── Profile.tsx ────────── Trang thông tin cá nhân và chỉnh sửa ảnh đại diện
│       │   ├── Setting.tsx ────────── Trang thiết lập tài khoản
│       │   ├── AdminDashboard.tsx ─── Bảng điều khiển quản trị hệ thống của Admin
│       │   └── Auth Pages ─────────── Giao diện Login, Register, ForgotPassword, VerifyEmail...
│       │
│       ├── components/ ────────────── Các Component tái sử dụng
│       │   ├── Layout.tsx ─────────── Bọc giao diện chung (Sidebar điều hướng, Header)
│       │   ├── ErrorBoundary.tsx ──── Xử lý crash ứng dụng
│       │   ├── admin/ ─────────────── Các tab quản trị (Duyệt hàng đợi tài liệu, Quản lý User/Category)
│       │   └── users/ ─────────────── Component con (ChatBox, UploadZone, Form lập tùy chọn sinh Quiz)
│       │
│       ├── hooks/ ─────────────────── Các Custom Hooks React hữu ích (gọi dữ liệu, phân trang)
│       └── types/ ─────────────────── Định nghĩa các kiểu Type/Interface TypeScript
│
└── server/ ────────────────────────── MÃ NGUỒN BACKEND SERVER (NestJS)
    ├── package.json
    ├── nest-cli.json
    ├── tsconfig.json
    ├── eng.traineddata ────────────── Dữ liệu mô hình OCR tiếng Anh phục vụ cho Tesseract
    ├── vie.traineddata ────────────── Dữ liệu mô hình OCR tiếng Việt phục vụ cho Tesseract
    └── src/
        ├── main.ts ────────────────── Điểm khởi động ứng dụng Server NestJS
        ├── app.module.ts ──────────── Module gốc khai báo liên kết Database & tất cả Module con
        ├── app.controller.ts
        ├── app.service.ts
        │
        ├── database/ ──────────────── Module kết nối PostgreSQL thông qua TypeORM
        ├── decorators/ ────────────── Các Decorator bảo vệ route (@Public, @Roles)
        │
        ├── auth/ ──────────────────── Module xác thực người dùng
        │   ├── auth.controller.ts
        │   ├── auth.service.ts ────── Xử lý mã hóa mật khẩu, tạo AccessToken & RefreshToken JWT
        │   └── passport/ ──────────── Cấu hình các chiến lược Passport (Local, Jwt, Google OAuth2)
        │
        ├── users/ ─────────────────── Module quản lý hồ sơ người dùng
        │   └── entity/user.entity.ts ── Schema bảng người dùng (Users) trong cơ sở dữ liệu
        │
        ├── categories/ ────────────── Module quản lý danh mục tài liệu (môn học)
        │
        ├── documents/ ─────────────── Module xử lý File & Quét OCR (Quan trọng)
        │   ├── documents.controller.ts ── API đăng ký upload file, tải file, kích hoạt OCR
        │   ├── documents.service.ts ─── Xử lý trích xuất văn bản thô (PDF, Word, Excel, Text) và chạy Tesseract OCR
        │   ├── constants/file-types.ts ─ Khai báo danh sách các đuôi file & MIME cho phép tải lên
        │   └── entities/document.entity.ts ─ Schema bảng tài liệu (Tiêu đề, kích thước, text trích xuất)
        │
        ├── chat/ ──────────────────── Module giao tiếp AI & Sinh nội dung học tập (Quan trọng)
        │   ├── chat.controller.ts ─── REST endpoints & SSE endpoint phát luồng dữ liệu chat (`/stream`)
        │   ├── chat.service.ts ────── Chứa cấu hình Prompt, gọi Gemini SDK, phân luồng RAG, tạo Quiz/Bài học
        │   └── entities/ ──────────── Schema lưu trữ phiên chat (ChatSession) & tin nhắn (ChatMessage)
        │
        ├── quizz/ ─────────────────── Module lưu kết quả thi trắc nghiệm & trả về biểu đồ thống kê
        ├── lectures/ ──────────────── Module lưu trữ và xuất bản các bài giảng đã soạn thảo bởi AI
        └── mail/ ──────────────────── Module biên soạn và gửi mail thông báo (xác thực email, reset mật khẩu)
```

---

## 🚀 Hướng dẫn cài đặt và khởi chạy dự án

### 📋 Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (Phiên bản khuyến nghị: v18 trở lên hoặc v20).
*   Đã cài đặt và đang chạy cơ sở dữ liệu **PostgreSQL**.

---

### Bước 1: Cấu hình Cơ sở dữ liệu
1.  Mở PostgreSQL Client (pgAdmin hoặc CLI).
2.  Tạo một cơ sở dữ liệu mới có tên:
    ```sql
    CREATE DATABASE as_study;
    ```

---

### Bước 2: Cài đặt và cấu hình Backend (Server)

1.  Di chuyển vào thư mục server:
    ```bash
    cd server
    ```
2.  Cài đặt các gói phụ thuộc:
    ```bash
    npm install
    ```
3.  Tạo file `.env` ở thư mục `server/` (tham khảo cấu hình mẫu bên dưới):
    ```env
    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=YOUR_POSTGRES_PASSWORD
    DB_NAME=as_study

    # Server Port
    PORT=3000
    NODE_ENV=development
    FRONTEND_URL=http://localhost:5173

    # JWT Authentication Key
    JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
    JWT_ACCESS_EXPIRES_IN=15m
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
    JWT_REFRESH_EXPIRES_IN=7d
    REFRESH_TOKEN_PEPPER=your_pepper_key_here

    # Google Generative AI (Gemini API Key)
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # Google OAuth2 Setup (Tùy chọn)
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

    # Mailer (Tùy chọn - Dùng gửi mail xác thực)
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USER=YOUR_EMAIL
    MAIL_PASS=YOUR_EMAIL_APP_PASSWORD
    MAIL_FROM=YOUR_EMAIL
    ```
4.  Khởi chạy máy chủ Backend ở chế độ phát triển:
    ```bash
    npm run start:dev
    ```
    *Mặc định backend sẽ chạy trên cổng `http://localhost:3000`.*

---

### Bước 3: Cài đặt và cấu hình Frontend (Client)

1.  Mở một terminal mới và di chuyển vào thư mục client:
    ```bash
    cd client
    ```
2.  Cài đặt các gói phụ thuộc:
    ```bash
    npm install
    ```
3.  Khởi chạy máy chủ Frontend:
    ```bash
    npm run dev
    ```
    *Mặc định giao diện client sẽ khởi chạy tại đường dẫn `http://localhost:5173`.*

---

## 📌 Các lưu ý quan trọng khi triển khai dự án

1.  **Chạy OCR Offline**: Dự án đã tích hợp sẵn hai file mô hình `eng.traineddata` và `vie.traineddata` trong thư mục [server/](file:///e:/Phen/%C4%90%E1%BB%93%20%C3%A1n%20c%C6%A1%20s%E1%BB%9F%20KHMT/AS-Study/server). Khi chạy dự án, hãy đảm bảo các file này nằm đúng vị trí để Tesseract.js có thể tải và thực thi nhận diện chữ viết chính xác mà không gặp lỗi kết nối máy chủ dữ liệu từ xa.
2.  **Khóa API Gemini**: Đăng ký lấy khóa API Gemini miễn phí tại Google AI Studio và điền vào trường `GEMINI_API_KEY` trong tệp cấu hình `.env` để kích hoạt tính năng chat thông minh, sinh câu hỏi thi trắc nghiệm và soạn thảo bài giảng.
3.  **Tự động Đồng bộ DB**: Ở chế độ phát triển (`NODE_ENV=development`), TypeORM sẽ tự động đồng bộ hóa tạo các bảng vào database `as_study` khi server khởi chạy lần đầu tiên.