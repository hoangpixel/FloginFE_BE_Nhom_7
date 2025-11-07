import React, { createContext, useContext, useState } from 'react';

type AuthCtx = { token: string | null; login(t: string): void; logout(): void; };
const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const login = (t: string) => { setToken(t); localStorage.setItem('token', t); };
  const logout = () => { setToken(null); localStorage.removeItem('token'); };
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
