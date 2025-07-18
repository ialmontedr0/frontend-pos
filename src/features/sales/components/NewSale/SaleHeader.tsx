import { useState, useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import type { Customer } from '../../../customers/interfaces/CustomerInterface';
import { TrashBinIcon, PlusIcon } from '../../../../assets/icons';

interface SaleHeaderProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (c: Customer | null) => void;
  onCustomerQuery: (q: string) => void;
  productSearch: string;
  onSearchChange: (q: string) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAdd: (product: string, cantidad: number) => void;
  total: number;
}

export const SaleHeader: React.FC<SaleHeaderProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onCustomerQuery,
  productSearch,
  onSearchChange,
  quantity,
  onQuantityChange,
  onAdd,
  total,
}) => {
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const customerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onCustomerQuery(customerQuery);
  }, [customerQuery]);

  return (
    <div className="lg:flex lg:items-center justify-between text-black dark:text-gray-200 p-4 border-b">
      <div className="flex flex-col sm:flex-row lg:flex-row items-left md:items-center lg:items-center md:space-x-3 lg:space-x-3 space-y-2 md:space-y-0 lg:space-y-0">
        <div className="relative">
          <input
            ref={customerInputRef}
            type="text"
            className="border rounded-lg px-3 py-2 w-xs placeholder-gray-500"
            placeholder="Buscar cliente..."
            value={selectedCustomer?.nombre || customerQuery}
            onChange={(e) => {
              setCustomerQuery(e.target.value);
              onSelectCustomer(null);
            }}
          />
          {!selectedCustomer && customerQuery && (
            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-auto z-10">
              {customers.map((c) => (
                <li
                  key={c._id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelectCustomer(c);
                    setCustomerQuery('');
                  }}
                >
                  {c.nombre}
                </li>
              ))}
            </ul>
          )}
          {selectedCustomer && (
            <button
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => onSelectCustomer(null)}
            >
              <TrashBinIcon />
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            className="border rounded-lg px-3 py-2 w-xs placeholder-gray-500"
            placeholder="Buscar producto..."
            value={productSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <BiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        <input
          type="number"
          min={1}
          className="border rounded-lg px-3 py-2 w-20 text-center"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
        />
        <button
          className="flex items-center justify-center w-10 h-10 bg-white text-black hover:bg-gray-100 transition-colors rounded-full shadow"
          onClick={() => onAdd(productSearch, quantity)}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="text-right hidden md:block lg:block">
        <span className="block text-gray-500">Total</span>
        <span className="text-2xl font-bold">RD$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};
