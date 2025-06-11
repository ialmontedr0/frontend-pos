import { useState, type ChangeEvent, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface SearchSelectItem {
  _id: string;
  nombre: string;
  [key: string]: any;
}

interface SearchSelectProps {
  options: SearchSelectItem[];
  onSelect: (item: SearchSelectItem) => void;
  placeholder?: string;
  className?: string;
  initialDisplayValue?: string;
  fieldValue?: string;
  onFieldChange?: (value: string) => void;
  onFieldBlur?: () => void;
  nombre?: string;
}

export function SearchSelect({
  options,
  onSelect,
  placeholder = 'Buscar...',
  className,
  initialDisplayValue = '',
  fieldValue, // _id
  onFieldChange,
  onFieldBlur,
  nombre,
}: SearchSelectProps) {
  const [query, setQuery] = useState<string>(initialDisplayValue);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = query
    ? options.filter((item) => item.nombre.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (
      initialDisplayValue !== query &&
      initialDisplayValue !== '' &&
      initialDisplayValue !== undefined
    ) {
      setQuery(initialDisplayValue);
    }
  }, [initialDisplayValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);

    if (e.target.value === '' && onFieldChange) {
      onFieldChange('');
      onSelect({ _id: '', nombre: '' });
    }
  };

  const handleItemClick = (item: SearchSelectItem) => {
    setQuery(item.nombre);
    onSelect(item);
    if (onFieldChange) {
      onFieldChange(item._id);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutsid = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        if (onFieldBlur) {
          onFieldBlur();
        }
        const selectedOption = options.find((opt) => opt._id === fieldValue);
        if (!selectedOption || selectedOption.nombre !== query) {
          setQuery(selectedOption?.nombre || '');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutsid);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsid);
    };
  }, [options, fieldValue, query, onFieldBlur]);

  return (
    <div className={cn('relative', className)} ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {}}
        name={nombre}
        placeholder={placeholder}
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
