import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { clearAuth, logout } from '../../features/auth/slices/authSlice';
import { useAppDispath } from '../../hooks/hooks';

export interface SidebarLink {
  label: string;
  to: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  links: SidebarLink[];
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearAuth());
    navigate('/auth/login');
  };

  const links: SidebarLink[] = [
    {
      label: 'Usuarios',
      to: 'users',
    },
    {
      label: 'Clientes',
      to: 'customers',
    },
  ];

  return (
    <aside
      className={`
        h-full transition-width duration-300
        ${isOpen ? 'w-64' : 'w-16'}
        bg-white dark:bg-green-900
        border-r border-slate-200 dark:border-slate-700
        text-slate-800 dark:text-slate-200 
        shadow-inner dark:shadow-inner-black/20 
      `}
    >
      <button
        onClick={onToggle}
        className="p-2 focus:outline-none"
        aria-label="Toggle sidebar"
      ></button>
      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="
            flex items-center p-2 rounded-md
            hover:bg-slate-100 dark:hover:bg-slate-800
            focus:outline-none focus:bg-slate-200 dark:focus:bg-slate-700"
          >
            <span className="ml-2">{isOpen ? link.label : link.label.charAt(0)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

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
