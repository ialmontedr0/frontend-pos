import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { cn } from '../../lib/utils';

interface SearchSelectItem {
  _id: string;
  nombre: string;
  [key: string]: any;
}

interface SearchSelectProps {
  options: SearchSelectItem[];
  onSelect: (id: string) => void; // Se invoca con el _id seleccionado
  onFieldChange: (value: string) => void; // Se invoca en cada cambio de texto o seleccion
  onFieldBlur?: () => void;
  fieldValue?: string; // Valor actual del _ID
  initialDisplayValue?: string; // Texto a mostrar inicialmente
  placeholder?: string;
  name?: string;
  className?: string;
}

export function SearchSelect({
  options,
  onSelect,
  onFieldChange,
  fieldValue,
  onFieldBlur,
  initialDisplayValue = '',
  placeholder = 'Buscar...',
  name,
  className,
}: SearchSelectProps) {
  const [query, setQuery] = useState<string>(initialDisplayValue);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = query
    ? options.filter((o) => o.nombre.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    setQuery(initialDisplayValue);
  }, [initialDisplayValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setShowDropdown(true);
    onFieldChange?.(v);
    if (v === '') {
      onSelect('');
    }
  };

  const handleItemClick = (item: SearchSelectItem) => {
    setQuery(item.nombre);
    onSelect(item._id);
    onFieldChange?.(item._id);
    setShowDropdown(false);
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        onFieldBlur?.();

        const sel = options.find((o) => o._id === fieldValue);
        setQuery(sel?.nombre || '');
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [fieldValue, onFieldBlur, options]);

  return (
    <div className={cn('relative', className)} ref={wrapperRef}>
      <input
        type="text"
        name={name}
        value={query}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredOptions.map((item) => (
            <li
              key={item._id}
              onClick={() => handleItemClick(item)}
              className="px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer text-gray-900 dark:text-gray-100"
            >
              {item.nombre}
            </li>
          ))}
        </ul>
      )}
      {showDropdown && query && filteredOptions.length === 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 px-3 py-2 text-gray-500 dark:text-gray-400">
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
}
