import type { Product } from '../types';

interface ProductDetailProps {
    product: Product | null;
    onClose: () => void;
    onEdit?: (p: Product) => void;
}

export default function ProductDetail({ product, onClose, onEdit }: ProductDetailProps) {
    if (!product) return null;
    return (
        <div className="space-y-4" data-testid="product-detail">
            <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">ID:</span> {product.id}</div>
                <div><span className="font-medium">Tên:</span> {product.name}</div>
                <div><span className="font-medium">Giá:</span> {product.price.toLocaleString()}</div>
                <div><span className="font-medium">Số lượng:</span> {product.quantity}</div>
                <div className="md:col-span-2"><span className="font-medium">Danh mục:</span> {product.category}</div>
                <div className="md:col-span-2"><span className="font-medium">Mô tả:</span> {product.description || '(Không có)'}</div>
            </div>
            <div className="flex gap-3 justify-end">
                {onEdit && <button className="px-3 py-2 border rounded" onClick={() => onEdit(product)} data-testid="btn-edit">Sửa</button>}
                <button className="px-3 py-2 border rounded" onClick={onClose} data-testid="btn-close-detail">Đóng</button>
            </div>
        </div>
    );
}
