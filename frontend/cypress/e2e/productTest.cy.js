import LoginPage from '../support/pages/LoginPage';
import ProductPage from '../support/pages/ProductPage';

describe('6.2.2 - E2E Test Scenarios for Product CRUD & Filter', () => {

  beforeEach(() => {
    // --- GIẢI PHÁP ĐĂNG NHẬP 1 LẦN ---
    // Sử dụng cy.session để lưu trạng thái đăng nhập vào cache với ID 'admin-session'
    cy.session('admin-session', () => {
        // Các lệnh trong này chỉ chạy 1 lần duy nhất (hoặc khi session bị xóa)
        cy.clearCookies();
        cy.clearLocalStorage();
        
        LoginPage.visit();
        LoginPage.login('admin', 'Test123');
        
        // Quan trọng: Phải có verify để đảm bảo login thành công trước khi cache session
        cy.url({ timeout: 10000 }).should('include', '/products');
    });

    // Sau khi restore session, Cypress sẽ trả về trang trắng, nên cần visit lại trang Products
    cy.visit('http://localhost:5173/products');
    cy.wait(1000); // Đợi data load xong
  });

  afterEach(() => {
    // Cleanup: Đảm bảo quay về trang products nếu test bị redirect đi đâu đó
    cy.url().then(url => {
      if (!url.includes('/products')) {
        cy.visit('http://localhost:5173/products');
      }
    });
  });

  // --- Test UI elements interactions ---
  it('TC1: Kiem tra hien thi danh sach san pham', () => {
    ProductPage.productTable.should('be.visible');
    ProductPage.btnAddProduct.should('be.visible').and('be.enabled');
  });

  // --- Test Create product flow ---
  it('TC2: Them san pham moi thanh cong', () => {
    const productName = 'Test Product ' + Date.now();
    ProductPage.addProduct(productName, '100000', '10', 'ELECTRONICS', 'Mo ta san pham test');

    ProductPage.productTable.should('be.visible');
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  // --- Test Read product flow ---
  it('TC3: Hien thi danh sach san pham co san', () => {
    ProductPage.productItems.should('have.length.at.least', 1);
    ProductPage.productTable.should('be.visible');
  });

  // --- Test Update product flow ---
  it('TC4: Cap nhat thong tin san pham thanh cong', () => {
    const oldName = 'Product to Update ' + Date.now();
    const newName = 'Updated Product ' + Date.now();
    
    // Tạo nhanh 1 sản phẩm để sửa
    ProductPage.addProduct(oldName, '100000', '10', 'ELECTRONICS', 'Mo ta');
    ProductPage.productTable.should('be.visible');
    cy.wait(500); 
    
    // Sửa sản phẩm đầu tiên
    cy.get('[data-testid="product-item"]').first().find('[data-testid="edit-btn"]').click();
    
    ProductPage.txtProductName.clear().type(newName);
    ProductPage.txtProductPrice.clear().type('200000');
    ProductPage.btnSubmit.click();

    ProductPage.productTable.should('be.visible');
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  // --- Test Delete product flow ---
  it('TC5: Xoa san pham thanh cong', () => {
    // Stub window.confirm
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    
    cy.get('[data-testid="product-item"]').first()
      .find('[data-testid="delete-btn"]')
      .click();
    
    cy.wait(1000); // Đợi xóa xong
    cy.url().should('include', '/products');
    ProductPage.productTable.should('be.visible');
  });

  // --- Test Pagination functionality (ĐÃ FIX: Thêm thao tác click) ---
  it('TC6: Kiem tra phan trang san pham', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination-controls"]').length > 0) {
        cy.get('[data-testid="pagination-controls"]').should('be.visible');
        
        // 1. Kiểm tra đang ở Trang 1 (nút 1 sáng)
        cy.get('[data-testid="page-btn-1"]').should('have.class', 'bg-indigo-50');

        // 2. THỰC HIỆN: Click sang Trang 2
        cy.get('[data-testid="page-btn-2"]').click();
        cy.wait(500); // Đợi load trang 2

        // 3. VERIFY: Kiểm tra nút 2 sáng, nút 1 tắt
        cy.get('[data-testid="page-btn-2"]').should('have.class', 'bg-indigo-50');
        cy.get('[data-testid="page-btn-1"]').should('not.have.class', 'bg-indigo-50');

        // Kiểm tra nút "Trang trước" đã enable
        cy.contains('button', 'Trang trước').should('not.be.disabled');
      } else {
        cy.log('Không đủ dữ liệu để test phân trang (cần > 5 items)');
      }
    });
  });

});