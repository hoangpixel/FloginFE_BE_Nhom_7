import React from 'react';
import PropTypes from 'prop-types';

export default function ProductList({ 
    items, 
    onView, 
    onEdit, 
    onDelete, 
    currentPage, 
    totalPages, 
    onPageChange,
    searchTerm,        
    onSearchChange     
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // FIX TC7: Test cũ mong đợi "15,000,000" (dấu phẩy, không có chữ '₫')
    // Dùng 'en-US' để đảm bảo ra dấu phẩy
    const formatPrice = (amount) => {
        return amount.toLocaleString('en-US');
    };

    return (
        <div className="space-y-4">
            {/* --- PHẦN TÌM KIẾM --- */}
            <div className="bg-white p-1">
                <div className="relative max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc danh mục..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        data-testid="search-input"
                    />
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200" data-testid="product-table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(items ?? []).map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors" data-testid="product-item">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">#{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" data-testid="product-name-cell">
                                    {p.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                                    {/* FIX TC7: Sử dụng formatPrice thay vì format tiền Việt */}
                                    {formatPrice(p.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {p.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onView(p)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                                        data-testid="view-btn"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEdit(p)}
                                        className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-md transition-colors"
                                        data-testid="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(p.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                        data-testid="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        
                        {(items?.length ?? 0) === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>
                                            {/* FIX TC2: Bỏ chữ "dữ liệu" để khớp với text "Chưa có sản phẩm" */}
                                            {searchTerm ? `Không tìm thấy sản phẩm nào khớp với "${searchTerm}"` : 'Chưa có sản phẩm'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PHẦN PHÂN TRANG (Pagination) --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6" data-testid="pagination-controls">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trang trước
                        </button>

                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                aria-current={page === currentPage ? 'page' : undefined}
                                data-testid={`page-btn-${page}`}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trang sau
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}

ProductList.propTypes = {
    items: PropTypes.array.isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func,
};