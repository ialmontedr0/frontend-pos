import React, { createContext, useContext, useEffect, useState } from 'react';
import type { RootState } from '../store/store';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { setUserTheme } from '../features/users/slices/usersSlice';

export type Theme = 'claro' | 'oscuro' | 'sistema';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const [theme, setThemeState] = useState<Theme>('sistema');

  const applyClass = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (t === 'oscuro') root.classList.add('dark');
    if (t === 'sistema')
      root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  useEffect(() => {
    const userTheme = authUser?.configuracion?.tema as Theme | undefined;
    const storedTheme = (localStorage.getItem(STORAGE_KEY) as Theme) || 'sistema';
    const initial = userTheme || storedTheme
    setThemeState(initial);
    applyClass(initial);
    localStorage.setItem(STORAGE_KEY, initial);
  }, [authUser]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyClass(t);
    localStorage.setItem(STORAGE_KEY, t);
    if (authUser) dispatch(setUserTheme(t));
  };

  const toggleTheme = () => {
    const order: Theme[] = ['claro', 'oscuro', 'sistema'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error(`useTheme debe usarse dentro de ThemeProvider`);
  return ctx;
};
