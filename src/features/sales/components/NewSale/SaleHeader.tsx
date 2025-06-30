import { BiCodeBlock } from 'react-icons/bi';

interface SaleHeaderProps {
  customer: string;
  onCustomerChange: (c: string) => void;
  productSearch: string;
  onSearchChange: (v: string) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAddClick: () => void;
}

export const SaleHeader: React.FC<SaleHeaderProps> = ({
  customer,
  onCustomerChange,
  productSearch,
  onSearchChange,
  quantity,
  onQuantityChange,
  onAddClick,
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1d2939] border-b">
    <div className="w-full border border-blue-900 flex items-center space-x-3 text-black dark:text-gray-200">
      <h1 className="text-black dark:text-gray-200 text-lg font-medium">Nueva Venta</h1>
      <input
        type="text"
        value={customer}
        onChange={(e) => onCustomerChange(e.target.value)}
        placeholder="Cliente"
        className="ml-4 px-3 py-2 border rounded w-32 placeholder-gray-400"
      />
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
        <BiCodeBlock />
      </button>
      <input
        type="text"
        value={productSearch}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar producto"
        className="px-3 py-2 border rounded w-72"
      />
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
        className="w-20 px-3 py-2 border rounded text-center"
      />
      <button
        onClick={onAddClick}
        className="ml-2 flex shadow items-center justify-center w-10 h-10 bg-white text-black dark:text-black border rounded-full hover:bg-gray-50"
      >
        +
      </button>
    </div>

    <div className="px-6 py-2 text-right bg-gray-100 w-sm rounded flex items-center space-x-4">
      <span className="text-xl font-bold">0.00</span>
    </div>
  </div>
);

