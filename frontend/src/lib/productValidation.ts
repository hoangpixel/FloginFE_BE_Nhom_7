const MAX_PRICE = 999999999;
const MAX_QUANTITY = 99999;
const MAX_DESCRIPTION_LENGTH = 500;
// Mảng các category hợp lệ
const VALID_CATEGORIES: string[] = [
    "ELECTRONICS",
    "FASHION",
    "FOOD",
    "HOME",
    "OTHER"
];
export const validateProduct = (
    productname: string,
    price: GLfloat,
    quantity: number,
    description: string,
    category: string
): string => {
    if (!productname || productname.trim() === '') {
        return 'Tên sản phẩm không được để trống.';
    }
    const nameLength = productname.trim().length;
    if (nameLength < 3 || nameLength > 100) {
        return 'Tên sản phẩm phải có từ 3 đến 100 ký tự.';
    }
    if (typeof price !== 'number' || isNaN(price) || price <= 0 || price > MAX_PRICE) {
        return `Giá sản phẩm phải lớn hơn 0 và không được vượt quá ${MAX_PRICE.toLocaleString()}.`;
    }
    if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) {
        return `Số lượng phải là số nguyên không âm và không được vượt quá ${MAX_QUANTITY.toLocaleString()}.`;
    }
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        return `Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự.`;
    }
    if (!category || category.trim() === '') {
        return 'Danh mục sản phẩm không được để trống.';
    }
    const inputCategory = category.trim().toUpperCase();
    if (!VALID_CATEGORIES.includes(inputCategory)) {
        return 'Danh mục sản phẩm không hợp lệ hoặc không có sẵn.';
    }
    //Trả về chuỗi rỗng nếu validation thành công
    return '';
};
