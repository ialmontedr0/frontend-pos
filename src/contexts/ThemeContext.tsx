import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/hooks';
import { useAppDispath } from '../hooks/hooks';
import { toggleUserTheme, updateUserSettings } from '../features/users/slices/usersSlice';

export type Theme = 'claro' | 'oscuro' | 'sistema';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispath();
  const currentUser = useAppSelector((state) => state.auth.user);

  const detectInitialTheme = (): Theme => {
    if (currentUser?.configuracion?.tema === 'claro') return 'claro';
    if (currentUser?.configuracion?.tema === 'oscuro') return 'oscuro';

    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'sistema';
  };

  const [theme, setThemeState] = useState<Theme>(detectInitialTheme());

  const applyClass = (t: Theme) => {
    const root = document.documentElement;
    // quitamos el dark primero
    root.classList.remove('dark');
    if (t === 'oscuro') {
      root.classList.add('dark');
    } else if (t === 'sistema') {
      // Sistema: anade o quita segun media query
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  };

  useEffect(() => {
    const init = detectInitialTheme();
    setThemeState(init);
    applyClass(init);
  }, [currentUser]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyClass(t);

    if (!currentUser) {
      localStorage.setItem(STORAGE_KEY, t);
    }
  };

  const toggleTheme = () => {
    const order: Theme[] = ['claro', 'oscuro', 'sistema'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    const payload: { tema: 'claro' | 'oscuro' | 'sistema' } = {
      tema: next,
    };
    dispatch(toggleUserTheme(next));
    console.log(payload);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error(`useTheme debe estar dentro del ThemeProvider`);
  return ctx;
};
