import { validateProduct } from '../utils/productValidation';
import '@testing-library/jest-dom';
if (!HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function () {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  };
}
const VALID_PRODUCT_DATA = {
  name: 'Laptop Dell Inspiron',
  price: 15000000,
  quantity: 50,
  description: 'Mo ta hop le cho san pham',
  category: 'ELECTRONICS'
};
describe('Product Validation Tests', () => {
  test('TC1: Product hop le - nen khong co loi', () => {
    const errors = validateProduct(VALID_PRODUCT_DATA);
    expect(Object.keys(errors).length).toBe(0);
  });
  test('TC2: Ten san pham rong - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, name: '' };
    const errors = validateProduct(product);
    expect(errors.name).toBe('Ten san pham khong duoc de trong');
  });
  test('TC3: Ten san pham qua ngan (2 ky tu) - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, name: 'AB' };
    const errors = validateProduct(product);
    expect(errors.name).toBe('Ten san pham phai co tu 3 den 100 ky tu');
  });
  test('TC4: Gia san pham la so am - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, price: -1000 };
    const errors = validateProduct(product);
    expect(errors.price).toBe('Gia san pham phai lon hon 0');
  });
  test('TC5: Gia san pham vuot qua MAX - nen tra ve loi', () => {
    const MAX_PLUS_ONE = 1000000000;
    const product = { ...VALID_PRODUCT_DATA, price: MAX_PLUS_ONE };
    const errors = validateProduct(product);
    expect(errors.price).toContain('khong duoc vuot qua 999999999');
  });
  test('TC6: So luong la so am - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, quantity: -1 };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('So luong phai la so nguyen khong am');
  });
  test('TC7: So luong vuot qua MAX - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, quantity: 100000 };
    const errors = validateProduct(product);
    expect(errors.quantity).toContain('khong duoc vuot qua 99999');
  });
  test('TC8: Mo ta qua dai - nen tra ve loi', () => {
    const tooLongDesc = 'X'.repeat(501);
    const product = { ...VALID_PRODUCT_DATA, description: tooLongDesc };
    const errors = validateProduct(product);
    expect(errors.description).toContain('khong duoc vuot qua 500 ky tu');
  });
  test('TC9: Danh muc khong co san - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, category: 'PETS' };
    const errors = validateProduct(product);
    expect(errors.category).toBe('Danh muc san pham khong hop le hoac khong co san');
  });
  test('TC10: Gia san pham bi thieu - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA };
    delete product.price;
    const errors = validateProduct(product);
    expect(errors.price).toBe('Gia san pham khong duoc de trong');
  });
  test('TC11: Gia san pham khong phai la so - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, price: 'abc' };
    const errors = validateProduct(product);
    expect(errors.price).toBe('Gia san pham phai la so');
  });
  test('TC12: So luong bi thieu - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA };
    delete product.quantity;
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('So luong khong duoc de trong');
  });
  test('TC13: So luong la so thap phan - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, quantity: 10.5 };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('So luong phai la so nguyen');
  });
  test('TC14: So luong la chu - nen tra ve loi', () => {
    const product = { ...VALID_PRODUCT_DATA, quantity: 'xyz' };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe('So luong phai la so nguyen');
  });
  test('TC15: Danh muc rong - nen bo qua (khong co loi category)', () => {
    const product = { ...VALID_PRODUCT_DATA, category: '' };
    const errors = validateProduct(product);
    expect(errors.category).toBeUndefined();
  });
});