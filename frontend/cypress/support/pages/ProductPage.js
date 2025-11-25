class ProductPage {
  
  // --- Selectors ---
  get inventoryItems() {
    return cy.get('.inventory_item');
  }

  get cartBadge() {
    return cy.get('.shopping_cart_badge');
  }

  get sortDropdown() {
    return cy.get('.product_sort_container');
  }

  // --- Actions ---
  // Đảm bảo hàm này nằm TRONG dấu ngoặc {} của class
  addToCart(productName) {
    cy.contains('.inventory_item_name', productName) 
      .parents('.inventory_item')                    
      .find('button')                                
      .click();                                      
  }

  removeFromCart(productName) {
    cy.contains('.inventory_item_name', productName)
      .parents('.inventory_item')
      .find('button')
      .click(); 
  }

  selectSortOption(value) {
    this.sortDropdown.select(value);
  }
}

// ⚠️ QUAN TRỌNG: Phải có chữ 'new' và dấu '()'
export default new ProductPage();