import React from 'react';
import PropTypes from 'prop-types';

export default function ProductList({ items, onView, onEdit, onDelete, currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="space-y-4">
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
                        // Thêm data-testid="product-item" để Cypress tìm được dòng sản phẩm (Listing 15)
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
                                    // Quan trọng: data-testid cho E2E test (Listing 16)
                                    data-testid="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => onDelete(p.id)}
                                    // Quan trọng: data-testid cho E2E test (Listing 16)
                                    data-testid="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(items?.length ?? 0) === 0 && (
                        <tr>
                            <td colSpan={6} className="p-3 text-center text-gray-500">
                                Chưa có sản phẩm
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* PHẦN PHÂN TRANG */}
            {
                totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2" data-testid="pagination-controls">

                        {/* Nút Previous */}
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </button>

                        {/* Các nút số trang */}
                        {pages.map(page => (
                            <button
                                key={page}
                                className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-black text-white' : 'bg-white'}`}
                                onClick={() => onPageChange(page)}
                                // Thêm data-testid để dễ dàng kiểm thử E2E
                                data-testid={`page-btn-${page}`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Nút Next */}
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                )
            }
        </div >
    );
}

// Validation props thay thế cho TypeScript Interface
ProductList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            price: PropTypes.number,
            quantity: PropTypes.number,
            category: PropTypes.string,
        })
    ).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};