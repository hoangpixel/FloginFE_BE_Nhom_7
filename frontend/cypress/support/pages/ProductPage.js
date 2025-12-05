class ProductPage {
  
  // --- 1. Selectors ---

  get productTable() {
    return cy.get('[data-testid="product-table"]', { timeout: 10000 });
  }

  get productItems() {
    return cy.get('[data-testid="product-item"]');
  }

  get btnAddProduct() {
    return cy.get('[data-testid="add-product-btn"]');
  }

  get btnEdit() {
    return cy.get('[data-testid="edit-btn"]');
  }

  get btnDelete() {
    return cy.get('[data-testid="delete-btn"]');
  }

  get btnView() {
    return cy.get('[data-testid="view-btn"]');
  }

  // Form fields
  get txtProductName() {
    return cy.get('[data-testid="product-name"]');
  }

  get txtProductPrice() {
    return cy.get('[data-testid="product-price"]');
  }

  get txtProductQuantity() {
    return cy.get('[data-testid="product-quantity"]');
  }

  get selectCategory() {
    return cy.get('[data-testid="product-category"]');
  }

  get txtDescription() {
    return cy.get('[data-testid="product-description"]');
  }

  get btnSubmit() {
    return cy.get('[data-testid="submit-button"]');
  }

  get txtSearch() {
    return cy.get('[data-testid="search-input"]');
  }
  // --- 2. Actions ---
  visit() {
    cy.visit('http://localhost:5173/products');
  }

  addProduct(name, price, quantity, category, description) {
    this.btnAddProduct.click();
    
    cy.get('[data-testid="product-form"]', { timeout: 5000 }).should('be.visible');
    
    this.txtProductName.type(name);
    this.txtProductPrice.clear().type(price);
    this.txtProductQuantity.clear().type(quantity);
    if (category) {
      this.selectCategory.select(category);
    }
    if (description) {
      this.txtDescription.type(description);
    }
    this.btnSubmit.click();
  }

  editProduct(productName, newName, newPrice, newQuantity) {
    cy.contains('[data-testid="product-name-cell"]', productName)
      .parents('[data-testid="product-item"]')
      .find('[data-testid="edit-btn"]')
      .click();
    this.txtProductName.clear().type(newName);
    this.txtProductPrice.clear().type(newPrice);
    if (newQuantity) {
      this.txtProductQuantity.clear().type(newQuantity);
    }
    this.btnSubmit.click();
  }

}

export default new ProductPage();