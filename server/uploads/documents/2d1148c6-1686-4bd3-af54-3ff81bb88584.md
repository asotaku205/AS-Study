# Docs4Study

Nền tảng chia sẻ tài liệu học tập được xây dựng với **React** (Frontend) và **Express.js** (Backend), sử dụng **MongoDB** làm cơ sở dữ liệu.

---

## Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cách 1: Chạy bằng Docker (Khuyến nghị)](#cách-1-chạy-bằng-docker-khuyến-nghị)
- [Cách 2: Chạy thủ công (Không dùng Docker)](#cách-2-chạy-thủ-công-không-dùng-docker)
- [Biến môi trường](#biến-môi-trường)
- [Tài khoản mặc định](#tài-khoản-mặc-định)

---

## Yêu cầu hệ thống

### Chạy bằng Docker

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (bao gồm Docker Compose)

### Chạy thủ công

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) (đi kèm Node.js)
- [MongoDB](https://www.mongodb.com/) (cài local hoặc dùng MongoDB Atlas)

---

## Cấu trúc dự án

```
Docs4Study/
├── client/          # Frontend - React + Vite + TailwindCSS
├── server/          # Backend - Express.js + Mongoose
├── docker-compose.yml
├── .env             # Biến môi trường chung (Docker)
└── README.md
```

---

## Cách 1: Chạy bằng Docker (Khuyến nghị)

### Bước 1: Build và chạy

```bash
docker-compose up --build
```

Nếu muốn chạy ngầm (background):

```bash
docker-compose up --build -d
```

### Bước 2: Truy cập ứng dụng

| Dịch vụ  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost              |
| Backend  | http://localhost:5001/api     |
| MongoDB  | localhost:27017              |

### Dừng ứng dụng

```bash
docker-compose down
```

Dừng và xóa dữ liệu (volume):

```bash
docker-compose down -v
```

---

## Cách 2: Chạy thủ công (Không dùng Docker)

### Bước 1: Clone dự án

```bash
git clone <repository-url>
cd Docs4Study
```

### Bước 2: Cấu hình Backend

```bash
cd server
npm install
```

CLIENT_URL=http://localhost:5173
```

Chạy server (dev mode):

```bash
npm run dev
```

Server sẽ chạy tại **http://localhost:5001**

### Bước 3: Cấu hình Frontend

Mở terminal mới:

```bash
cd client
npm install
```

```bash
npm run dev
```

Frontend sẽ chạy tại **http://localhost:5173**

### Bước 4: Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5173**

