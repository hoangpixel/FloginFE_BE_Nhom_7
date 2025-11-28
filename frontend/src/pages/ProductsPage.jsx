import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/product';
import { logout } from '../services/auth';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

// --- SỬA Ở ĐÂY: Thêm dấu { } vào import để khớp với file ProductDetail ---
import { ProductDetail } from '../components/ProductDetail';

// Import danh mục cứng
import { VALID_CATEGORIES } from '../utils/productValidation';
const PAGE_SIZE = 5;
export default function ProductsPage() {
  const nav = useNavigate();
  // State categories không cần thiết nữa vì đã có VALID_CATEGORIES
  const [fullList, setFullList] = useState([]); // danh sách đầy đủ để phân trang client
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(PAGE_SIZE);
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit' | 'detail'
  const [current, setCurrent] = useState(null);

  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  // Load danh sách sản phẩm khi vào trang hoặc khi trang thay đổi
  useEffect(() => {
    async function fetchAll() {
      try {
        const all = await getProducts(); // API trả về mảng
        setFullList(all);
        const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
        setTotalPages(pages);
        const start = (currentPage - 1) * PAGE_SIZE;
        setItems(all.slice(start, start + PAGE_SIZE));
      } catch (error) {
        console.error('Loi khi tai danh sach san pham', error);
        setFullList([]);
        setItems([]);
        setTotalPages(1);
      }
    }
    if (mode === 'list') {
      fetchAll();
    }
  }, [currentPage, mode]);

  function onLogout() {
    logout();
    nav('/login', { replace: true });
  }
  async function handleSave(payload) {
    try {
      if (mode === 'edit' && current) {
        await updateProduct(current.id, payload);
      } else {
        await createProduct(payload);
      }
      // Sau khi save refetch tất cả để cập nhật phân trang
      setMode('list');
      setCurrent(null);
      setCurrentPage(1); // quay về trang đầu hiển thị sản phẩm mới
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu sản phẩm: ' + error.message);
    }
  }

  async function onDelete(id) {
    // Lưu ý: Cypress mặc định auto-confirm các window.confirm này
    if (!window.confirm('Xoá sản phẩm này?')) return;

    try {
      await deleteProduct(id);
      // refetch full list sau khi xóa
      if (currentPage > 1 && (items.length === 1)) {
        // nếu xóa phần tử cuối trang, lùi về trang trước (nếu có)
        setCurrentPage(currentPage - 1);
      } else {
        // giữ nguyên trang, nhưng trigger refetch qua mode/list hoặc currentPage
        setMode('list');
      }
    } catch (error) {
      alert('Không thể xóa sản phẩm');
    }
  }
  function onPageChange(newPage) {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }
  function startCreate() {
    setCurrent(null);
    setMode('create');
  }

  function startEdit(p) {
    setCurrent(p);
    setMode('edit');
  }

  function startDetail(p) {
    setCurrent(p);
    setMode('detail');
  }

  function backToList() {
    setMode('list');
    setCurrent(null);
  }

  return (
    // data-testid="products-page" khớp với Listing 15 trong PDF (cy.visit)
    <div className="max-w-5xl mx-auto p-6 space-y-6" data-testid="products-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          {mode === 'list' && (
            <button
              className="px-3 py-2 rounded bg-black text-white"
              onClick={startCreate}
              // QUAN TRỌNG: data-testid này bắt buộc phải có để chạy E2E Test (Listing 15)
              data-testid="add-product-btn"
            >
              Thêm sản phẩm
            </button>
          )}
          <span className="text-sm text-gray-600">Hi, {user}</span>
          <button className="px-3 py-1 border rounded" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {mode === 'list' && (
        <ProductList
          items={items}
          onView={startDetail}
          onEdit={startEdit}
          onDelete={onDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <ProductForm
          mode={mode === 'create' ? 'create' : 'edit'}
          // Truyền trực tiếp danh sách categories vào form
          categories={VALID_CATEGORIES}
          initial={mode === 'edit' ? current : null}
          onSave={handleSave}
          onCancel={backToList}
        />
      )}

      {mode === 'detail' && (
        <ProductDetail
          product={current}
          onClose={backToList}
          onEdit={(p) => startEdit(p)}
        />
      )}
    </div>
  );
}