# Flogin Project – Nhóm 7

Bài Tập Lớn - Kiểm Thử Phần Mềm
 Ứng dụng **Đăng nhập** & **Quản lý Sản phẩm**

---

## Công nghệ sử dụng
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

---

## Yêu cầu hệ thống
- **Java 17+**
- **Node.js 18+**
- **pnpm**
- **Maven 3.9+**

---

## 🍃 1. Hướng dẫn chạy Backend (Spring Boot)
###  Bước 1: Sử dụng **XAMPP** khởi động chạy với **Apache** và **MySQL** có port lần lượt là **8080** và **3306**

### Bước 2: Điều hướng vào thư mục **Backend** (ưu tiên chạy trên terminal của JavaSE-21)
```bash
cd backend
```

###  Bước 3: Build dự án
```bash
mvn -q clean package
```

###  Bước 4: Khởi chạy server, server sẽ tự động tạo database tên là **flogin** và tự động thêm 2 bảng **auth** và **products**
```bash
mvn spring-boot:run
```

---

## ⚛️ 2. Hướng dẫn chạy Frontend (Vite + React)
Dự án sử dụng **pnpm** để quản lý package.
###  Bước 1: Điều hướng vào thư mục **Frontend**
```bash
cd frontend
```

###  Bước 2: Cài đặt dependencies
```bash
pnpm install
```

###  Bước 3: Chạy môi trường development
```bash
pnpm run dev
```

---

## 🧪 3. Hướng dẫn Kiểm thử (Testing)

# 🔬 A. Frontend Unit Test (Jest)
###  Chạy test 1 file cụ thể
```bash
pnpm test:file "tên_file"
```

###  Chạy coverage 1 file
```bash
pnpm test:file:cov "tên_file"
```

###  Chạy coverage toàn bộ
```bash
pnpm test:cov:full
```

###  Xem báo cáo coverage (Windows)
```bash
start "" ".\\coverage\\lcov-report\\index.html"
```

---

# 🔎 B. Backend Unit Test (JUnit + JaCoCo)
###  Chạy test cho 1 file cụ thể
```bash
mvn -Dtest="tên file test" test
```

###  Chạy toàn bộ test + xuất báo cáo JaCoCo
```bash
mvn -q clean test jacoco:report
```

###  Xem báo cáo JaCoCo (Windows)
```bash
start "" ".\\target\\site\\jacoco\\index.html"
```

---

# 🛠 C. End-to-End Testing (Cypress)
### Bước 1: Cài đặt Cypress
```bash
cd frontend
pnpm install
npx cypress install
```

### Bước 2: Chạy **Backend** và **Frontend**
### Bước 2.1: Chạy **Backend**
```bash
cd backend
```
```bash
mvn spring-boot:run
```

### Bước 2.2: Chạy **Backend**
```bash
cd frontend
```
```bash
pnpm run dev
```

#### Bước 3: Mở giao diện GUI
#### Cách 1: Mở giao diện GUI
```bash
pnpm cy:open
```
Sau đó chọn E2E Testing
Rồi chọn trình duyệt muốn hiển thị
Sau đó chọn 1 trong 3 file loginTest.cy.js/productTest.cy.js/securityTest.cy.js để chạy

#### Cách 2: Chạy headless (phục vụ CI/CD)
```bash
pnpm cy:run
```

---

## 🗂️ Cấu trúc thư mục
```
FloginFE_BE_Nhom_7/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flogin/
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   └── ProductController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── LoginResponse.java
│   │   │   │   │   └── ProductRequest.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── AuthUser.java
│   │   │   │   │   ├── Category.java
│   │   │   │   │   └── Product.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── AuthUserRepository.java
│   │   │   │   │   └── ProductRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── Application.java
│   │   │   │   │   └── WebConfig.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql
│   │   ├── test/
│   │   │   └── java/com/flogin/
│   │   │       ├── controller/
│   │   │       │   ├── AuthControllerIntegrationTest.java
│   │   │       │   ├── AuthControllerMockTest.java
│   │   │       │   ├── ProductControllerIntegrationTest.java
│   │   │       │   └── ProductControllerMockTest.java
│   │   │       └── service/
│   │   │           ├── AuthServiceTest.java
│   │   │           ├── ProductServiceTest.java
│   │   │           └── ProductServiceMockTest.java
│   ├── pom.xml
│   └── .gitignore
│
└── frontend/
       └── cypress/
       │       ├── e2e/
       │       │   ├── loginTest.cy.js
       │       │   ├── productTest.cy.js
       │       │   └── securityTest.cy.js
       │       └── support/
       │           │   └── pages/
       │           │          ├── LoginPage.js
       │           │          └── ProductPage.js
       │           ├── commands.js
       │           └── e2e.js
       └── performance/
       │           └── api_load_test.js
       └── src/
       │    ├── components/
       │    │      ├── Login.jsx
       │    │      ├── ProductDetail.jsx
       │    │      ├── ProductForm.jsx
       │    │      └── ProductList.jsx
       │    ├── pages/
       │    │      ├── ProductsPage.jsx
       │    │      └── ProtectedRoute.jsx
       │    ├── services/
       │    │      ├── auth.js
       │    │      ├── axios.js
       │    │      └── product.js
       │    ├── tests/
       │    │      ├── Login.integration.test.js
       │    │      ├── LoginPage.test.js
       │    │      ├── loginValidation.test.js
       │    │      ├── ProductDetail.integration.test.js
       │    │      ├── ProductForm.integration.test.js
       │    │      ├── ProductForm.test.js
       │    │      ├── ProductList.integration.test.js
       │    │      ├── ProductMock.test.js
       │    │      └── productValidation.test.js
       │    └── utils/
       │           ├── productValidation.js
       │           └── validation.js
       │
       └── .gitignore
```

---

## 👥 Thành viên Nhóm 7
| Thành viên | MASSV | Tỉ lệ đóng góp |
|----------|------|-----------|
| Phạm Minh Hoàng | `3123410114` | 25% | 
| Lê Minh Huy | `3123410121` | 25% | 
| Trịnh Việt Thắng | `3123410347` | 25% | 
| Nguyễn Đức Đạt  | `3123410068` | 25% | 
---

## © Bản quyền
```
© 2025 Flogin Project - Nhóm 7. Faculty of Information Technology, Saigon University.
