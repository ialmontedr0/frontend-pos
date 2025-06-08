import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { clearAuth, logout } from '../../features/auth/slices/authSlice';
import { useAppDispath, useAppSelector } from '../../hooks/hooks';
import { NotificationsModal } from '../../features/notifications/components/NotificationsModal';
import { selectUnreadCount } from '../../features/notifications/slices/notificationsSlice';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { SearchBar } from '../SearchBar/SearchBar';

export interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const enabled = theme === 'oscuro';
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const unreadCount = useAppSelector(selectUnreadCount);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearAuth());
    navigate('/auth/login');
  };

  return (
    <header
      className="
      flex items-center justify-between 
      dark:bg-red-100 bg-blue-800 
      text-slate-900 dark:text-slate-100
      px-4 py-2 
      border-b border-slate-200 dark:border-slate-700
      shadow-sm dark:shadow-black/20
    "
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="
            p-2 rounded 
            hover:bg-slate-100 dark:hover:bg-slate-800
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
          "
          aria-label="Toggle sidebar"
        >
          <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></div>
        </button>

        {/* <input
          type="text"
          placeholder="Buscar..."
          className="
            px-3 py-1 
            border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-800
            text-slate-800 dark:text-slate-200
            placeholder-slate-400 dark:placeholder-slate-500
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          "
        /> */}

        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsModal
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'claro' && '🌞'}
          {theme === 'oscuro' && '🌜'}
          {theme === 'sistema' && '🌐'}
        </button> */}
        <ThemeToggle enabled={enabled} onClick={toggleTheme} />

        <Link
          to="/user/profile"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <img
            src={
              user?.foto ||
              'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg'
            }
            alt="Perfil"
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden md:block text-gray-800 dark:text-gray-200">
            {user ? (
              <>
                <p className="font-medium">{`${user.nombre} ${user.apellido}`}</p>
                <p className="text-sm">{user.rol}</p>
              </>
            ) : (
              <p className="text-italic">Invitado</p>
            )}
          </div>
        </Link>

        <Link
          to="/user/settings"
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          ⚙️
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
