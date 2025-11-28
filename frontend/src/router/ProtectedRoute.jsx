import { Navigate } from 'react-router-dom';
import { isAuthed } from '../services/auth';
import PropTypes from 'prop-types'; // Cài npm install prop-types nếu chưa có

export default function ProtectedRoute({ children }) {
  // Kiểm tra token từ localStorage (hàm isAuthed đã viết ở services/auth.js)
  if (!isAuthed()) {
    // Nếu chưa đăng nhập, đá về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, render nội dung bên trong (ví dụ: ProductsPage)
  return <>{children}</>;
}

// Validation props (thay thế cho Type ReactNode của TS)
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};