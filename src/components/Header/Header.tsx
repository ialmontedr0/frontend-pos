import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { clearAuth, logout } from '../../features/auth/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { NotificationsModal } from '../../features/notifications/components/NotificationsModal';
import { selectUnreadCount } from '../../features/notifications/slices/notificationsSlice';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { SearchBar } from '../SearchBar/SearchBar';
import { BiBell, BiCog, BiLogOut } from 'react-icons/bi';
import type { RootState } from '../../store/store';

export interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const enabled = theme === 'oscuro';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const user = useAppSelector((state: RootState) => state.auth.user);
  const unreadCount = useAppSelector(selectUnreadCount);

  const routeTitles: { [path: string]: string } = {
    '/dashboard': 'Dashboard',
    '/users': 'Usuarios',
    '/customers': 'Clientes',
    '/products': 'Productos',
    '/sales': 'Ventas',
    '/payments': 'Pagos',
    '/notifications': 'Notificaciones',
    '/cash-registers': 'Cajas',
    '/stats': 'Estadisticas',
    '/sync-logs': 'Sync Logs',
    '/user/profile': 'Perfil',
    '/user/settings': 'Configuracion',
  };

  let headerTitle = routeTitles[currentPath] ?? '';

  if (!headerTitle) {
    for (const path in routeTitles) {
      if (currentPath.startsWith(path)) {
        headerTitle = routeTitles[path];
        break;
      }
    }
  }

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearAuth());
    navigate('/auth/login');
  };

  return (
    <header
      className="
      flex items-center justify-between 
      bg-white dark:bg-gray-900 border-b 
      text-slate-900 dark:text-slate-100
      px-4 py-3 
      border-slate-200 dark:border-slate-700
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

        <SearchBar />
        {headerTitle && <h1 className="text-xl font-semibold">{headerTitle}</h1>}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded"
            aria-label="Toggle notifications"
          >
            <BiBell className="w-5 h-5 mx-2" />
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
          <BiCog className="w-5 h-5" />
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer"
        >
          <BiLogOut className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </header>
  );
}
