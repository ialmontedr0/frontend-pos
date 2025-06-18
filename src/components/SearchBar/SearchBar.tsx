import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { modules } from '../../constants/modules';
import { Input } from '../UI/Input/Input';

export function SearchBar() {
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const filtered = modules.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (to: string) => {
    navigate(to);
    setQuery('');
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder="Buscar"
      />
      {query && filtered.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-10">
          {filtered.map((m) => (
            <li
              key={m.to}
              onClick={() => handleSelect(m.to)}
              className="px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer"
            >
              {m.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
