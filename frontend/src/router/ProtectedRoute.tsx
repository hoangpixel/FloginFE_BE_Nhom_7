import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { isAuthed } from '../services/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
