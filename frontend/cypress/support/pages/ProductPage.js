class ProductPage {
  
  // --- 1. Selectors ---

  get inventoryItems() {
    return cy.get('.inventory_item');
  }

  get cartBadge() {
    return cy.get('.shopping_cart_badge');
  }

  get sortDropdown() {
    return cy.get('.product_sort_container');
  }

  // 👇 QUAN TRỌNG: CÁI BẠN ĐANG THIẾU LÀ DÒNG NÀY 👇
  get firstItemName() {
    // Lấy tên sản phẩm đầu tiên trong danh sách (để kiểm tra Sort)
    return cy.get('.inventory_item_name').first();
  }
  // 👆 ------------------------------------------ 👆

  // --- 2. Actions ---

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

export default new ProductPage();