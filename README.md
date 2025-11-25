# 🚀 Flogin Project – Nhóm 7

Ứng dụng Web với kiến trúc tách biệt **Frontend** và **Backend**, hỗ trợ kiểm thử tự động và triển khai dễ dàng.

---

## 🛠️ Công nghệ sử dụng
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

---

## 📦 Yêu cầu hệ thống
- **Java 17+**
- **Node.js 18+**
- **pnpm** (khuyến nghị)
- **Maven 3.9+**

---

## ☕ 1. Hướng dẫn chạy Backend (Spring Boot)
### 📍 Bước 1: Di chuyển vào thư mục backend
```bash
cd backend
```

### 📍 Bước 2: Build dự án
```bash
mvn -q clean package
```

### ▶️ Khởi chạy server
```bash
mvn spring-boot:run
```

Server mặc định chạy tại: **http://localhost:8080**

---

## 🎨 2. Hướng dẫn chạy Frontend (Vite + React)
Dự án sử dụng **pnpm** để quản lý package.

### 📍 Bước 1: Điều hướng vào thư mục
```bash
cd frontend
```

### 📍 Bước 2: Cài đặt dependencies
```bash
pnpm install
```

### ▶️ Chạy môi trường development
```bash
pnpm dev
```

Frontend chạy tại: **http://localhost:5173**

---

## 🧪 3. Hướng dẫn Kiểm thử (Testing)

# 🧩 A. Frontend Unit Test (Jest)
| Chức năng | Lệnh |
|----------|------|
| Chạy test 1 file cụ thể | `pnpm test:file "tên_file"` |
| Chạy coverage 1 file | `pnpm test:file:cov "tên_file"` |
| Chạy coverage toàn bộ | `pnpm test:cov:clean` |
| Xem báo cáo coverage (Windows) | `start "" ".\\coverage\\lcov-report\\index.html"` |

---

# ☕ B. Backend Unit Test (JUnit + JaCoCo)
### ▶️ Chạy test cho 1 file cụ thể
```bash
mvn -Dtest="tên file test" test
```

### ▶️ Chạy toàn bộ test + xuất báo cáo JaCoCo
```bash
mvn -q clean test jacoco:report
```

### ▶️ Xem báo cáo JaCoCo (Windows)
```bash
start "" ".\\target\\site\\jacoco\\index.html"
```

---

# 🤖 C. End-to-End Testing (Cypress)
### 📦 1. Cài đặt Cypress
```bash
pnpm install
npx cypress install
```

### ▶️ 2. Chạy Cypress
#### Cách 1: Mở giao diện GUI
```bash
pnpm exec cypress open
```
Hoặc nếu đã cấu hình script:
```bash
pnpm cy:open
```

#### Cách 2: Chạy headless (phục vụ CI/CD)
```bash
pnpm cy:run
```

---

## 🗂️ Cấu trúc thư mục (rút gọn)
```
Flogin/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## 👥 Thành viên Nhóm 7
- ✨ **Hoàng** – FE + BE
- ✨ **[Thêm các thành viên khác nếu có]**

---

## © Bản quyền
```
© 2025 Flogin Project - Nhóm 7. All rights reserved.
