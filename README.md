# FloginFE_BE_Nhom_7

-------- Hướng dẫn chạy BE --------

cd backend
xong chạy lần lượt 2 lệnh
mvn -q clean package
mvn spring-boot:run

-------- Hướng dẫn chạy FE --------

cd frontend
pnpm dev

-------- Cách chạy test case JEST ở FE --------
# chỉ login (validation.ts)
pnpm run test:cov:login

# chỉ product (product.ts)
pnpm run test:cov:product

# gộp cả login + product
pnpm run test:cov:both

-------- Cách chạy Junit ở BE --------
mvn -Dtest=AuthServiceTest test
mvn -q clean test jacoco:report
start "" ".\target\site\jacoco\index.html"

--------- Cách chạy Cypress-----------
## 🧪 Testing (Cypress)

#### Cài đặt
Hãy đảm bảo bạn đã cài đặt `pnpm` và các dependencies:

```bash
pnpm install
pnpm exec cypress install
pnpm exec cypress open
pnpm cy:open(pnpm cy:run)
