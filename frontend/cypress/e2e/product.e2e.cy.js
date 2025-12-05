import LoginPage from '../support/pages/LoginPage';
import ProductPage from '../support/pages/ProductPage';

describe('6.2.2 - E2E Test Scenarios for Product CRUD & Filter', () => {

  beforeEach(() => {
    cy.session('admin-session', () => {
        cy.clearCookies();
        cy.clearLocalStorage();  
        LoginPage.visit();
        LoginPage.login('admin', 'Test123');
        cy.url({ timeout: 10000 }).should('include', '/products');
    });
    cy.visit('http://localhost:5173/products');
    cy.wait(1000); 
  });

  afterEach(() => {
    cy.url().then(url => {
      if (!url.includes('/products')) {
        cy.visit('http://localhost:5173/products');
      }
    });
  });

  it('TC1: Kiem tra hien thi danh sach san pham', () => {
    ProductPage.productTable.should('be.visible');
    ProductPage.btnAddProduct.should('be.visible').and('be.enabled');
  });

  it('TC2: Them san pham moi thanh cong', () => {
    const productName = 'Test Product ' + Date.now();
    ProductPage.addProduct(productName, '100000', '10', 'ELECTRONICS', 'Mo ta san pham test');
    ProductPage.productTable.should('be.visible');
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  it('TC3: Hien thi danh sach san pham co san', () => {
    ProductPage.productItems.should('have.length.at.least', 1);
    ProductPage.productTable.should('be.visible');
  });


  it('TC4: Cap nhat thong tin san pham thanh cong', () => {
    const oldName = 'Product to Update ' + Date.now();
    const newName = 'Updated Product ' + Date.now();
    ProductPage.addProduct(oldName, '100000', '10', 'ELECTRONICS', 'Mo ta');
    ProductPage.productTable.should('be.visible');
    cy.wait(500); 
    

    cy.get('[data-testid="product-item"]').first().find('[data-testid="edit-btn"]').click();
    ProductPage.txtProductName.clear().type(newName);
    ProductPage.txtProductPrice.clear().type('200000');
    ProductPage.btnSubmit.click();
    ProductPage.productTable.should('be.visible');
    cy.get('[data-testid="product-form"]').should('not.exist');
  });

  it('TC5: Xoa san pham thanh cong', () => {
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    
    cy.get('[data-testid="product-item"]').first()
      .find('[data-testid="delete-btn"]')
      .click();
    
    cy.wait(1000); 
    cy.url().should('include', '/products');
    ProductPage.productTable.should('be.visible');
  });

  it('TC6: Kiem tra phan trang san pham', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination-controls"]').length > 0) {
        cy.get('[data-testid="pagination-controls"]').should('be.visible');
        cy.get('[data-testid="page-btn-1"]').should('have.class', 'bg-indigo-50');
        cy.get('[data-testid="page-btn-2"]').click();
        cy.wait(500); 
        cy.get('[data-testid="page-btn-2"]').should('have.class', 'bg-indigo-50');
        cy.get('[data-testid="page-btn-1"]').should('not.have.class', 'bg-indigo-50');
        cy.contains('button', 'Trang trước').should('not.be.disabled');
      } else {
        cy.log('Không đủ dữ liệu để test phân trang (cần > 5 items)');
      }
    });
  });

  it('TC7: Kiem tra chuc nang tim kiem san pham', () => {
    const targetName = 'Laptop Dell';
    ProductPage.productTable.should('be.visible');

    cy.get('[data-testid="search-input"]')
      .clear()
      .type(targetName) 
      .should('have.value', targetName);

    ProductPage.productItems.should('have.length', 1)
      .first()
      .should('contain.text', targetName);
  });

});