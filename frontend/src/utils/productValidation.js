const MAX_PRICE = 999999999;
const MAX_QUANTITY = 99999;
const MAX_DESCRIPTION_LENGTH = 500;

export const VALID_CATEGORIES = [
    "ELECTRONICS",
    "FASHION",
    "FOOD",
    "HOME",
    "OTHER"
];

    export const validateProduct = (product) => {
    const errors = {};
    const { name, price, quantity, description, category } = product;

    // --- 1. Validate Name ---
    if (!name || name.trim() === '') {
        errors.name = 'Ten san pham khong duoc de trong';
    } else {
        const nameLength = name.trim().length;
        if (nameLength < 3 || nameLength > 100) {
            errors.name = 'Ten san pham phai co tu 3 den 100 ky tu';
        }
    }

    // --- 2. Validate Price ---
    if (price === undefined || price === null || String(price).trim() === '') {
         errors.price = 'Gia san pham khong duoc de trong';
    } else if (typeof price !== 'number' || isNaN(price)) {
         errors.price = 'Gia san pham phai la so';
    } else if (price <= 0) {
        errors.price = 'Gia san pham phai lon hon 0';
    } else if (price > MAX_PRICE) {
        errors.price = `Gia san pham khong duoc vuot qua ${MAX_PRICE}`;
    }

    // --- 3. Validate Quantity ---
    if (quantity === undefined || quantity === null) {
        errors.quantity = 'So luong khong duoc de trong';
    } else if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity)) {
        errors.quantity = 'So luong phai la so nguyen';
    } else if (quantity < 0) {
        errors.quantity = 'So luong phai la so nguyen khong am';
    } else if (quantity > MAX_QUANTITY) {
        errors.quantity = `So luong khong duoc vuot qua ${MAX_QUANTITY}`;
    }

    // --- 4. Validate Description ---
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Mo ta khong duoc vuot qua ${MAX_DESCRIPTION_LENGTH} ky tu`;
    }
    if (!category || category.trim() === '') {
    } else {
        const inputCategory = category.trim().toUpperCase();
        if (!VALID_CATEGORIES.includes(inputCategory)) {
            errors.category = 'Danh muc san pham khong hop le hoac khong co san';
        }
    }
    return errors;
};