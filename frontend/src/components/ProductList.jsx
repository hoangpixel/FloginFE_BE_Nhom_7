import React from 'react';
import PropTypes from 'prop-types';

// Thêm props searchTerm và onSearchChange
export default function ProductList({ 
    items, 
    onView, 
    onEdit, 
    onDelete, 
    currentPage, 
    totalPages, 
    onPageChange,
    searchTerm,        // prop mới
    onSearchChange     // prop mới
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className="space-y-4">
            {/* --- PHẦN TÌM KIẾM (Mới) --- */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    className="border p-2 rounded w-full max-w-sm outline-none focus:ring-2 focus:ring-black/50"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    // Quan trọng cho E2E Test (câu e)
                    data-testid="search-input"
                />
            </div>

            {/* --- BẢNG DỮ LIỆU (Giữ nguyên) --- */}
            <table className="w-full border" data-testid="product-table">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Qty</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(items ?? []).map(p => (
                        <tr key={p.id} data-testid="product-item">
                            <td className="p-2 border text-center">{p.id}</td>
                            <td className="p-2 border" data-testid="product-name-cell">{p.name}</td>
                            <td className="p-2 border text-right">{p.price.toLocaleString()}</td>
                            <td className="p-2 border text-right">{p.quantity}</td>
                            <td className="p-2 border">{p.category}</td>
                            <td className="p-2 border text-center space-x-2">
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => onView(p)}
                                    data-testid="view-btn"
                                >
                                    Xem
                                </button>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => onEdit(p)}
                                    data-testid="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => onDelete(p.id)}
                                    data-testid="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(items?.length ?? 0) === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Chưa có sản phẩm'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PHẦN PHÂN TRANG */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2" data-testid="pagination-controls">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>

                    {pages.map(page => (
                        <button
                            key={page}
                            className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-black text-white' : 'bg-white'}`}
                            onClick={() => onPageChange(page)}
                            data-testid={`page-btn-${page}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
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
    // Validate 2 props mới
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func,
};