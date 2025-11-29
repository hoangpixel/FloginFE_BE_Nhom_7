import React from 'react';
import PropTypes from 'prop-types';

export function ProductDetail({ product, onClose, onEdit }) {
    if (!product) return null;

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
            data-testid="product-detail"
        >
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                
                {/* Backdrop mờ */}
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal Panel */}
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle z-10">
                    
                    {/* --- HEADER --- */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {/* Mẹo: Để test tìm thấy "1", ta bọc ID trong thẻ span riêng biệt */}
                                    Chi tiết sản phẩm #<span>{product.id}</span>
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Xem đầy đủ thông tin chi tiết về sản phẩm này.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BODY --- */}
                    <div className="px-6 py-4 space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</label>
                                <div className="text-xl font-bold text-gray-900 mt-1">{product.name}</div>
                            </div>
                            <div className="text-right">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</label>
                                {/* Revert về toLocaleString() để khớp test cũ: 15,000,000 */}
                                <div className="text-xl font-bold text-indigo-600 mt-1">
                                    {product.price?.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</label>
                                <div className="mt-1 text-sm font-medium text-gray-900">{product.category}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Kho hàng</label>
                                <div className="mt-1 text-sm font-medium text-gray-900">
                                    {/* Tách riêng số lượng ra thẻ span để getByText("10") hoạt động chính xác */}
                                    <span>{product.quantity}</span> <span className="text-gray-400 font-normal">sản phẩm</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả chi tiết</label>
                            <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {/* Revert text fallback về (Khong co) để khớp test cũ */}
                                {product.description ? product.description : '(Khong co)'}
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => onEdit(product)}
                                data-testid="btn-edit"
                            >
                                Sửa
                            </button>
                        )}
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                            data-testid="btn-close-detail"
                        >
                            Đóng
                        </button>
                    </div>
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