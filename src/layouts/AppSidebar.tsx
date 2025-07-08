import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  BiBarChart,
  BiBell,
  BiBox,
  BiCart,
  BiCategoryAlt,
  BiCheckbox,
  BiChevronDown,
  BiCog,
  BiDotsHorizontal,
  BiGroup,
  BiLogOut,
  BiMoney,
  BiMoneyWithdraw,
  BiPaperclip,
  BiSolidDashboard,
  BiSpreadsheet,
  BiSync,
  BiUser,
  BiUserCircle,
  BiUserPin,
} from 'react-icons/bi';
import { useSidebar } from '../contexts/SidebarContext';
import type { RootState } from '../store/store';
import { useAppSelector } from '../hooks/hooks';
import logoFullLight from '../assets/logos/logo_full_light.svg';
import logoFullDark from '../assets/logos/logo_full_dark.svg';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  subItems?: { name: string; icon: React.ReactNode; path: string }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const role = useAppSelector((state: RootState) => state.auth.user?.rol);

  let roleNav: NavItem[] = [];
  const commonItems: NavItem[] = [
    {
      name: 'Perfil',
      icon: <BiUserCircle />,
      path: '/user/profile',
    },
    {
      name: 'Configuracion',
      icon: <BiCog />,
      path: '/settings',
    },
    {
      name: 'Salir',
      icon: <BiLogOut />,
      action: () => {
        console.log(`Salir`);
      },
    },
  ];

  if (role === 'admin') {
    roleNav = [
      { name: 'Inicio', path: '/dashboard', icon: <BiSolidDashboard /> },
      { name: 'Usuarios', path: '/users', icon: <BiUser /> },
      { name: 'Clientes', path: '/customers', icon: <BiGroup /> },
      {
        name: 'Productos',
        path: '/products',
        icon: <BiBox />,
        subItems: [
          { name: 'Productos', path: '/products', icon: <BiBox /> },
          { name: 'Categorias', path: '/products/categories', icon: <BiCategoryAlt /> },
          { name: 'Proveedores', path: '/products/providers', icon: <BiUserPin /> },
          { name: 'Inventario', path: '/products/inventory', icon: <BiCheckbox /> },
        ],
      },
      { name: 'Ventas', path: '/sales', icon: <BiCart /> },
      { name: 'Pagos', path: '/payments', icon: <BiMoney /> },
      { name: 'Cajas', path: '/cash-registers', icon: <BiMoneyWithdraw /> },
      { name: 'Transacciones', path: '/transactions', icon: <BiSpreadsheet /> },
      { name: 'Facturas', path: '/invoices', icon: <BiPaperclip /> },
      { name: 'Sync Logs', path: '/sync-logs', icon: <BiSync /> },
      { name: 'Estadisticas', path: '/stats', icon: <BiBarChart /> },
    ];
  } else if (role === 'cajero') {
    roleNav = [
      { name: 'Inicio', path: '/dashboard', icon: <BiSolidDashboard /> },
      { name: 'Clientes', path: '/customers', icon: <BiGroup /> },
      {
        name: 'Productos',
        path: '/products',
        icon: <BiBox />,
        subItems: [
          { name: 'Productos', path: '/products', icon: <BiBox /> },
          { name: 'Categorias', path: '/products/categories', icon: <BiCategoryAlt /> },
          { name: 'Proveedores', path: '/products/providers', icon: <BiUserPin /> },
          { name: 'Inventario', path: '/products/inventory', icon: <BiCheckbox /> },
        ],
      },
      { name: 'Ventas', path: '/sales', icon: <BiCart /> },
      { name: 'Pagos', path: '/payments', icon: <BiMoney /> },
      { name: 'Cajas', path: '/cash-registers', icon: <BiMoneyWithdraw /> },
      { name: 'Facturas', path: '/invoices', icon: <BiPaperclip /> },
      { name: 'Transacciones', path: '/transactions', icon: <BiSpreadsheet /> },
      { name: 'Notificaciones', path: '/notifications', icon: <BiBell /> },
      { name: 'Sync Logs', path: '/sync-logs', icon: <BiSync /> },
      { name: 'Estadisticas', path: '/stats', icon: <BiBarChart /> },
    ];
  } else if (role === 'inventarista') {
    roleNav = [
      { name: 'Inicio', path: '/dashboard', icon: <BiSolidDashboard /> },
      {
        name: 'Productos',
        path: '/products',
        icon: <BiBox />,
        subItems: [
          { name: 'Productos', path: '/products', icon: <BiBox /> },
          { name: 'Categorias', path: '/products/categories', icon: <BiCategoryAlt /> },
          { name: 'Proveedores', path: '/products/providers', icon: <BiUserPin /> },
          { name: 'Inventario', path: '/products/inventory', icon: <BiCheckbox /> },
        ],
      },
    ];
  }
  const [openSubmenu, setOpenSubmenu] = useState<{ type: 'role' | 'common'; index: number } | null>(
    null
  );

  const [heights, setHeights] = useState<Record<string, number>>({});
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let matched = false;
    roleNav.forEach((item, i) => {
      if (item.subItems?.some((si) => si.path === location.pathname)) {
        setOpenSubmenu({ type: 'role', index: i });
        matched = true;
      }
    });

    if (!matched) setOpenSubmenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = refs.current[key];
      if (el) {
        setHeights((h) => ({ ...h, [key]: el.scrollHeight }));
      }
    }
  }, [openSubmenu]);

  const toggleSubMenu = (index: number, section: 'role' | 'common') =>
    setOpenSubmenu((prev) =>
      prev?.type === section && prev.index === index ? null : { type: section, index: index }
    );

  const renderSection = (items: NavItem[], section: 'role' | 'common') => (
    <ul className="flex flex-col gap-2">
      {items.map((item, idx) => {
        const hasSub = !!item.subItems;
        const isOpen = openSubmenu?.type === section && openSubmenu.index === idx;
        return (
          <li className="dark:text-gray-100" key={`${section}-${idx}`}>
            {hasSub ? (
              <button
                onClick={() => {
                  toggleSubMenu(idx, section);
                }}
                className="flex  items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-xl">{item.icon}</span>
                {(isExpanded || isMobileOpen) && (
                  <span className="ml-3 flex-1 text-left ">{item.name}</span>
                )}
                {hasSub && (
                  <BiChevronDown
                    className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
            ) : item.path ? (
              <Link
                to={item.path!}
                onClick={() => {
                  if (isMobileOpen) {
                    toggleMobileSidebar();
                  } else {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center w-full p-2 rounded ${
                  isActive(item.path!) ? 'bg-gray-200 dark:bg-gray-800' : ''
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="text-xl">{item.icon}</span>
                {(isExpanded || isMobileOpen) && (
                  <span className="ml-3 flex text-left">{item.name}</span>
                )}
              </Link>
            ) : (
              <div
                onClick={item.action}
                className={`flex items-center w-full p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="text-xl">{item.icon}</span>
                {(isExpanded || isMobileOpen) && (
                  <span className="ml-3 flex-1 text-left dark:text-gray-100">{item.name}</span>
                )}
              </div>
            )}

            {hasSub && (isExpanded || isMobileOpen) && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'h-auto' : 'h-0'
                }`}
              >
                <ul className="ml-8 mt-1 space-y-1">
                  {item.subItems!.map((si) => (
                    <li key={si.name}>
                      <Link
                        to={si.path}
                        className={`block p-2 rounded ${
                          isActive(si.path)
                            ? 'bg-gray-300 dark:bg-gray-700 '
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {si.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        transform transition-transform duration-300 fixed top-0 left-0 h-full mt-16 bg-white dark:bg-gray-900 border-r dark:border-none pl-2 z-50 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0 '
        } lg:translate-x-0 ${isExpanded ? 'lg:w-72' : 'lg:w-20'}
        `}
    >
      <div className="p-4 flex justify-center">
        {isExpanded ? (
          <>
            <img className="dark:hidden" src={logoFullLight} alt="Logo" width={32} height={32} />
            <img
              className="hidden dark:block"
              src={logoFullDark}
              alt="Logo"
              width={32}
              height={32}
            />
          </>
        ) : (
          <img src={logoFullDark} alt="Logo" width={32} height={32} />
        )}
      </div>

      <nav className="overflow-y-auto flex-1">
        <div className="mb-6">
          <h2
            className={`mb-4 text-xs font-bold uppercase flex leading-[20px] text-black dark:text-gray-400 ${
              !isExpanded ? 'lg:justify-center' : 'justify-start'
            }`}
          >
            {isExpanded ? 'Menu' : <BiDotsHorizontal className="h-5 w-5" />}
          </h2>
          {renderSection([...roleNav, ...commonItems], 'role')}
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
