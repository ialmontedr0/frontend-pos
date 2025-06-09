import { NavLink } from 'react-router-dom';
import { clearAuth, logout } from '../../features/auth/slices/authSlice';
import { useAppSelector, useAppDispath } from '../../hooks/hooks';
import {
  BiUser,
  BiGroup,
  BiBox,
  BiPackage,
  BiCart,
  BiMoney,
  BiBell,
  BiSync,
  BiBarChart,
  BiCog,
  BiUserCircle,
  BiLogOut,
  BiSolidDashboard,
} from 'react-icons/bi';
import type React from 'react';
import type { RootState } from '../../store/store';

export interface LinkItem {
  label: string;
  to: string;
  Icon: React.ComponentType<{ size?: string | number }>;
  action?: () => void;
}

export const Sidebar: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispath();
  const role = user?.rol;

  const commonLinks: LinkItem[] = [
    {
      label: 'Perfil',
      to: '/user/profile',
      Icon: BiUserCircle,
    },
    {
      label: 'Configuracion',
      to: '/user/settings',
      Icon: BiCog,
    },
    {
      label: 'Logout',
      to: '',
      Icon: BiLogOut,
      action: () => {
        dispatch(logout());
        dispatch(clearAuth());
      },
    },
  ];

  let navLinks: LinkItem[] = [];

  if (role === 'admin') {
    navLinks = [
      { label: 'Inicio', to: '/dashboard', Icon: BiSolidDashboard },
      { label: 'Usuarios', to: '/users', Icon: BiUser },
      { label: 'Clientes', to: '/customers', Icon: BiGroup },
      { label: 'Productos', to: '/products', Icon: BiBox },
      { label: 'Inventario', to: '/products/inventory', Icon: BiPackage },
      { label: 'Ventas', to: '/sales', Icon: BiCart },
      { label: 'Pagos', to: '/payments', Icon: BiMoney },
      { label: 'Notificaciones', to: '/notifications', Icon: BiBell },
      { label: 'Cajas', to: '/cash-registers', Icon: BiMoney },
      { label: 'Sync Logs', to: '/sync-logs', Icon: BiSync },
      { label: 'Estadisticas', to: '/stats', Icon: BiBarChart },
    ];
  } else if (role === 'cajero') {
    navLinks = [
      { label: 'Inicio', to: '/dashboard', Icon: BiSolidDashboard },
      { label: 'Clientes', to: '/customers', Icon: BiGroup },
      { label: 'Productos', to: '/products', Icon: BiBox },
      { label: 'Inventario', to: '/products/inventory', Icon: BiPackage },
      { label: 'Ventas', to: '/sales', Icon: BiCart },
      { label: 'Pagos', to: '/payments', Icon: BiMoney },
      { label: 'Notificaciones', to: '/notifications', Icon: BiBell },
      { label: 'Cajas', to: '/cash-registers', Icon: BiMoney },
      { label: 'Estadisticas', to: '/stats', Icon: BiBarChart },
    ];
  } else if (role === 'inventarista') {
    navLinks = [
      { label: 'Inicio', to: '/dashboard', Icon: BiSolidDashboard },
      { label: 'Productos', to: '/products', Icon: BiBox },
      { label: 'Inventario', to: '/products/inventory', Icon: BiPackage },
      { label: 'Notificaciones', to: '/notifications', Icon: BiBell },
    ];
  }

  return (
    <aside
      className={`
          ${isOpen ? 'w-64' : 'w-16'} transition-width duration-200 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full
        `}
    >
      <nav className="mt-4 space-y-2">
        {navLinks.map(({ label, to, Icon, action }) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => action?.()}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : 'font-normal'
              }`
            }
          >
            <Icon size={20} />
            {isOpen && <span className="ml-3">{label}</span>}
          </NavLink>
        ))}

        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 ">
          {commonLinks.map(({ label, to, Icon, action }) =>
            action ? (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Icon size={20} />
                {isOpen && <span className="ml-3">{label}</span>}
              </button>
            ) : (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''
                  }`
                }
              >
                <Icon size={20} />
                {isOpen && <span className="ml-3">{label}</span>}
              </NavLink>
            )
          )}
        </div>
      </nav>
    </aside>
  );
};

/* Generate a Users Page for a PoS web app minimalist, professional and advanced with a Header and Sidebar 

Header contains in horizontal order:
Button toggle show/hide Sidebar
Search Bar
Current page title
Notifications show/hide icon
Theme toggle icon
Profile icon
Current Time
Logout Icon

Sidebar contains:
Button close Sidebar
Links to:
Usuarios
Clientes
Productos
Inventario
Ventas
Facturas
Cash Registers
_________________
Notificaciones
Perfil
Configuracion
Logout

El body de la pagina debe contener un table de ejemplo con los siguientes encabezados:
Foto   |    Usuario   |   Nombre   |    Correo   |   Telefono   |   Rol   |    Estado   |   Acciones

Acciones:
Ver, Editar, Restablecer contrasena, Eliminar */
