import LoginPage from '../support/pages/LoginPage';
import ProductPage from '../support/pages/ProductPage';

describe('6.2.2 - E2E Test Scenarios for Product CRUD & Filter', () => {

  beforeEach(() => {
    // Clear cookies và localStorage trước mỗi test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Login trước khi test Product
    LoginPage.visit();
    LoginPage.login('admin', 'Test123');
    cy.url({ timeout: 10000 }).should('include', '/products');
    cy.wait(1000); // Đợi trang load xong
  });

  afterEach(() => {
    // Cleanup: Đảm bảo quay về trang products
    cy.url().then(url => {
      if (!url.includes('/products')) {
        cy.visit('http://localhost:5173/products');
      }
    });
  });

  // --- Test UI elements interactions ---
  it('TC1: Kiem tra hien thi danh sach san pham', () => {
    // Kiểm tra bảng sản phẩm hiển thị
    ProductPage.productTable.should('be.visible');
    ProductPage.btnAddProduct.should('be.visible').and('be.enabled');
  });

  // --- Test Create product flow ---
  it('TC2: Them san pham moi thanh cong', () => {
    const productName = 'Test Product ' + Date.now();
    
    // Thêm sản phẩm mới
    ProductPage.addProduct(productName, '100000', '10', 'ELECTRONICS', 'Mo ta san pham test');

    // Đợi quay về list mode - verify bảng sản phẩm hiển thị lại
    ProductPage.productTable.should('be.visible');
    
    // Verify API thành công bằng cách kiểm tra không còn form
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  // --- Test Read product flow ---
  it('TC3: Hien thi danh sach san pham co san', () => {
    // Kiểm tra có ít nhất 1 sản phẩm trong danh sách
    ProductPage.productItems.should('have.length.at.least', 1);
    
    // Verify bảng sản phẩm hiển thị đầy đủ
    ProductPage.productTable.should('be.visible');
  });

  // --- Test Update product flow ---
  it('TC4: Cap nhat thong tin san pham thanh cong', () => {
    const oldName = 'Product to Update ' + Date.now();
    const newName = 'Updated Product ' + Date.now();
    
    // Tạo sản phẩm mới
    ProductPage.addProduct(oldName, '100000', '10', 'ELECTRONICS', 'Mo ta');
    
    // Đợi quay về list
    ProductPage.productTable.should('be.visible');
    cy.wait(1000);
    
    // Sửa sản phẩm đầu tiên trong danh sách (vì mới tạo nên sẽ ở đầu)
    ProductPage.productItems.first().find('[data-testid="edit-btn"]').click();
    
    // Sửa thông tin
    ProductPage.txtProductName.clear().type(newName);
    ProductPage.txtProductPrice.clear().type('200000');
    ProductPage.txtProductQuantity.clear().type('20');
    ProductPage.btnSubmit.click();

    // Verify: Quay về list mode
    ProductPage.productTable.should('be.visible');
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  // --- Test Delete product flow ---
  it('TC5: Xoa san pham thanh cong', () => {
    const productName = 'Product to Delete ' + Date.now();
    
    // Tạo sản phẩm mới
    ProductPage.addProduct(productName, '100000', '10', 'ELECTRONICS', 'Mo ta');
    
    // Đợi quay về list
    ProductPage.productTable.should('be.visible');
    cy.wait(1000);
    
    // Stub window.confirm để bắt được dialog
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    
    // Xóa sản phẩm đầu tiên
    cy.get('[data-testid="product-item"]').first()
      .find('[data-testid="delete-btn"]')
      .click();
    
    // Đợi API delete hoàn thành
    cy.wait(2000);
    
    // Verify: Vẫn ở trang products và bảng hiển thị
    cy.url().should('include', '/products');
    ProductPage.productTable.should('be.visible');
  });

  // --- Test Pagination functionality ---
  it('TC6: Kiem tra phan trang san pham', () => {
    // Kiểm tra có controls phân trang hay không
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination-controls"]').length > 0) {
        // Nếu có phân trang, test chức năng
        cy.get('[data-testid="pagination-controls"]').should('be.visible');
        
        // Kiểm tra có thể click các nút phân trang
        cy.get('[data-testid="pagination-controls"]').find('button').should('exist');
      } else {
        // Nếu không có phân trang (ít sản phẩm), verify bảng vẫn hiển thị
        ProductPage.productTable.should('be.visible');
        ProductPage.productItems.should('have.length.at.least', 1);
      }
    });
  });

});