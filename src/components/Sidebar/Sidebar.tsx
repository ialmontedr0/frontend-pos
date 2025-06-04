import { Link } from 'react-router-dom';

export interface SidebarLink {
  label: string;
  to: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  links: SidebarLink[];
}

export function Sidebar({ isOpen, onToggle, links }: SidebarProps) {
  return (
    <aside
      className={`
        h-full transition-width duration-300
        ${isOpen ? 'w-64' : 'w-16'}
        bg-white dark:bg-slate-900
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
          <Link key={link.to} to={link.to} 
            className="
            flex items-center p-2 rounded-md
            hover:bg-slate-100 dark:hover:bg-slate-800
            focus:outline-none focus:bg-slate-200 dark:focus:bg-slate-700">
            <span className="ml-2">{isOpen ? link.label : link.label.charAt(0)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
