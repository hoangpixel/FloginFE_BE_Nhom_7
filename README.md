# FloginFE_BE_Nhom_7

-------- Hướng dẫn chạy BE --------

cd backend
xong chạy lần lượt 2 lệnh
```bash
mvn -q clean package
mvn spring-boot:run
```

-------- Hướng dẫn chạy FE --------
```bash
cd frontend
pnpm dev
```
-------- Cách chạy test case JEST ở FE --------
```bash
# Chạy test ở đúng 1 file duy nhất
pnpm test:file "tên file"
# Chạy test cov ở đúng 1 file
pnpm test:file:cov "tên file"
# Chạy cov full file
pnpm test:cov:clean
# Xem cov
start "" ".\coverage\lcov-report\index.html"
```
-------- Cách chạy Junit ở BE --------
```bash
mvn -Dtest=AuthServiceTest test
mvn -q clean test jacoco:report
start "" ".\target\site\jacoco\index.html"
```
--------- Cách chạy Cypress-----------
## 🧪 Testing (Cypress)

#### Cài đặt
Hãy đảm bảo bạn đã cài đặt `pnpm` và các dependencies:

```bash
pnpm install
npx cypress install
pnpm exec cypress open
pnpm cy:open(pnpm cy:run)
