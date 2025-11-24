import type { Product } from '../types';

interface ProductListProps {
    items: Product[];
    onView: (p: Product) => void;
    onEdit: (p: Product) => void;
    onDelete: (id: number) => void;
}

export default function ProductList({ items, onView, onEdit, onDelete }: ProductListProps) {
    return (
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
                {items.map(p => (
                    <tr key={p.id}>
                        <td className="p-2 border text-center">{p.id}</td>
                        <td className="p-2 border">{p.name}</td>
                        <td className="p-2 border text-right">{p.price.toLocaleString()}</td>
                        <td className="p-2 border text-right">{p.quantity}</td>
                        <td className="p-2 border">{p.category}</td>
                        <td className="p-2 border text-center space-x-2">
                            <button className="px-2 py-1 border rounded" onClick={() => onView(p)}>Xem</button>
                            <button className="px-2 py-1 border rounded" onClick={() => onEdit(p)}>Edit</button>
                            <button className="px-2 py-1 border rounded" onClick={() => onDelete(p.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td colSpan={6} className="p-3 text-center text-gray-500">Chưa có sản phẩm</td></tr>
                )}
            </tbody>
        </table>
    );
}
