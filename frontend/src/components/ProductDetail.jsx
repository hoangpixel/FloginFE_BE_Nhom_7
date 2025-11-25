import React from 'react';
import PropTypes from 'prop-types';

// --- SỬA Ở ĐÂY: Xóa chữ 'default', chuyển thành Named Export ---
export function ProductDetail({ product, onClose, onEdit }) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" data-testid="product-detail">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Chi tiết sản phẩm</h2>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="font-bold">ID:</span> {product.id}</div>
                    <div><span className="font-bold">Tên:</span> {product.name}</div>
                    <div><span className="font-bold">Giá:</span> {product.price?.toLocaleString()}</div>
                    <div><span className="font-bold">Số lượng:</span> {product.quantity}</div>
                    <div><span className="font-bold">Danh mục:</span> {product.category}</div>
                    <div>
                        <span className="font-bold block">Mô tả:</span> 
                        <p className="bg-gray-50 p-2 rounded mt-1">{product.description || '(Không có)'}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-4">
                    {onEdit && (
                        <button 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => onEdit(product)}
                            // Test case tìm text /Sửa/i nên text này quan trọng
                            data-testid="btn-edit"
                        >
                            Sửa
                        </button>
                    )}
                    <button 
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" 
                        onClick={onClose}
                        data-testid="btn-close-detail"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

ProductDetail.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
        category: PropTypes.string,
        description: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
};