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
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const all = await getProducts();
        setFullList(all);
      } catch (error) {
        console.error('Loi khi tai danh sach san pham', error);
        setFullList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    let filtered = fullList;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = fullList.filter(p =>
        p.name.toLowerCase().includes(lowerTerm) ||
        p.category.toLowerCase().includes(lowerTerm)
      );
    }

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    setTotalPages(pages);

    let pageToLoad = currentPage;
    if (currentPage > pages) {
       pageToLoad = 1;
    }

    const start = (pageToLoad - 1) * PAGE_SIZE;
    setItems(filtered.slice(start, start + PAGE_SIZE));

  }, [fullList, searchTerm, currentPage]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
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

  function startCreate() { setCurrent(null); setMode('create'); }
  function startEdit(p) { setCurrent(p); setMode('edit'); }
  function startDetail(p) { setCurrent(p); setMode('detail'); }
  function backToList() { setMode('list'); setCurrent(null); }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900" data-testid="products-page">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Product Manager</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{user}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Section: Hiện khi ở List HOẶC Detail */}
        {(mode === 'list' || mode === 'detail') && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Danh sách sản phẩm</h2>
              <p className="text-gray-500 mt-1">Quản lý kho hàng và thông tin sản phẩm của bạn.</p>
            </div>
            <button
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
              onClick={startCreate}
              data-testid="add-product-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Thêm sản phẩm
            </button>
          </div>
        )}

        {/* --- CONTENT AREA --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="p-6">
              
              {/* Vẫn hiện ProductList khi mode là 'detail' để làm nền cho Popup */}
              {(mode === 'list' || mode === 'detail') && (
                <ProductList
                  items={items}
                  onView={startDetail}
                  onEdit={startEdit}
                  onDelete={onDelete}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                />
              )}

              {/* Form Create/Edit */}
              {(mode === 'create' || mode === 'edit') && (
                <div className="max-w-2xl mx-auto">
                   <div className="mb-6 pb-4 border-b">
                      <h3 className="text-lg font-bold text-gray-900">
                        {mode === 'create' ? 'Tạo sản phẩm mới' : 'Cập nhật sản phẩm'}
                      </h3>
                   </div>
                  <ProductForm
                    mode={mode === 'create' ? 'create' : 'edit'}
                    categories={VALID_CATEGORIES}
                    initial={mode === 'edit' ? current : null}
                    onSave={handleSave}
                    onCancel={backToList}
                  />
                </div>
              )}

              {/* Modal Detail nằm đè lên trên */}
              {mode === 'detail' && (
                <ProductDetail
                  product={current}
                  onClose={backToList}
                  onEdit={(p) => startEdit(p)}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}