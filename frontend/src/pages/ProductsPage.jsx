import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/product';
import { logout } from '../services/auth';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { ProductDetail } from '../components/ProductDetail';
import { VALID_CATEGORIES } from '../utils/productValidation';

const PAGE_SIZE = 5;

export default function ProductsPage() {
  const nav = useNavigate();
  const [fullList, setFullList] = useState([]); 
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState('list'); 
  const [current, setCurrent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. STATE MỚI: Lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  // 2. CẬP NHẬT LOGIC LỌC + PHÂN TRANG
  useEffect(() => {
    async function fetchAll() {
      try {
        // Nếu đã có fullList (từ lần load đầu), có thể ko cần gọi API lại nếu chỉ search client-side.
        // Tuy nhiên để đơn giản và đồng bộ với refreshKey, ta cứ gọi lại hoặc dùng fullList state.
        // Ở đây mình gọi lại để đảm bảo dữ liệu mới nhất.
        const all = await getProducts();
        setFullList(all);

        // --- BƯỚC LỌC (SEARCH/FILTER) ---
        let filtered = all;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = all.filter(p => 
                p.name.toLowerCase().includes(lowerTerm) || 
                p.category.toLowerCase().includes(lowerTerm)
            );
        }

        // --- BƯỚC PHÂN TRANG SAU KHI LỌC ---
        const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        setTotalPages(pages);
        
        // Reset về trang 1 nếu trang hiện tại vượt quá tổng số trang sau khi lọc
        let pageToLoad = currentPage;
        if (currentPage > pages) {
             pageToLoad = 1; // Khi search thường reset về trang 1
             setCurrentPage(1);
        }

        const start = (pageToLoad - 1) * PAGE_SIZE;
        setItems(filtered.slice(start, start + PAGE_SIZE));

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
  // 3. Thêm searchTerm vào dependency để khi gõ nó tự lọc lại
  }, [currentPage, mode, refreshKey, searchTerm]); 

  // Hàm xử lý khi gõ tìm kiếm
  const handleSearch = (term) => {
      setSearchTerm(term);
      setCurrentPage(1); // Luôn reset về trang 1 khi bắt đầu tìm kiếm mới
  };

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
      setMode('list');
      setCurrent(null);
      setRefreshKey(old => old + 1); 
      if (mode === 'create') setCurrentPage(1); 
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      if (currentPage > 1 && (items.length === 1)) {
        setCurrentPage(prev => prev - 1);
      } else {
        setRefreshKey(old => old + 1);
      }
      setMode('list');
    } catch (error) {
      alert('Không thể xóa sản phẩm');
    }
  }

  function onPageChange(newPage) {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  // ... (Các hàm startCreate, startEdit... giữ nguyên) ...
  function startCreate() { setCurrent(null); setMode('create'); }
  function startEdit(p) { setCurrent(p); setMode('edit'); }
  function startDetail(p) { setCurrent(p); setMode('detail'); }
  function backToList() { setMode('list'); setCurrent(null); }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6" data-testid="products-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          {mode === 'list' && (
            <button
              className="px-3 py-2 rounded bg-black text-white"
              onClick={startCreate}
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
          // 4. TRUYỀN PROPS XUỐNG
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />
      )}

      {/* ... Phần Form và Detail giữ nguyên ... */}
      {(mode === 'create' || mode === 'edit') && (
        <ProductForm
          mode={mode === 'create' ? 'create' : 'edit'}
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