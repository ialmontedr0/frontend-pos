import type { SaleItem } from './types';
import { BiCreditCard, BiSolidSchool, BiWallet, BiUser } from 'react-icons/bi';

interface SaleDetailsProps {
  items: SaleItem[];
  onQtyChange: (index: number, qty: number) => void;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ items, onQtyChange }) => (
  <div className="flex border border-red-500 h-full flex-col space-x-4 bg-white dark:bg-[#1d2939] text-black dark:text-gray-200">
    <div className="rounded-lg border p-4 max-h-[360px] overflow-y-auto">
      {items.map((it, i) => (
        <div key={it.producto._id} className="flex items-center justify-between mb-3 last:mb-0">
          <div className="flex items-start space-x-3">
            <input
              type="number"
              min={1}
              value={it.cantidad}
              onChange={(e) => onQtyChange(i, Number(e.target.value))}
              className="w-12 p-1 border rounded text-center"
            />
            <div>
              <div className="font-medium">Azucar</div>
              <div className="text-gray-500 text-sm">RD$ 500.00</div>
            </div>
          </div>
          <div className="font-medium">RD$ 1200.00</div>
        </div>
      ))}
      <hr className="my-2" />
      <div className="flex justify-end font-bold">RD$ 3000.00</div>
    </div>

    <div className="justify-end bg-gray-100 dark:bg-[#1d2939] m-1 rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <BiUser />
        <BiCreditCard />
        <BiSolidSchool />
        <BiWallet />
      </div>
      <div className="flex justify-between">
        <button className="flex-1 py-2 bg-gray-200 rounded-l">Efectivo</button>
        <button className="flex-1 py-2 border-t border-b">Tarjeta</button>
        <button className="flex-1 py-2 border-t border-b">Credito</button>
        <button className="flex-1 py-2 rounded-r">Puntos</button>
      </div>
    </div>

    <div className="flex justify-end space-x-3">
      <button className="px-4 py-2 bg-yellow-400 text-white rounded">Agregar</button>
      <button className="px-4 py-2 border rounded">Restablecer</button>
      <button className="px-4 py-2 border rounded text-blue-600">Realizar</button>
    </div>
  </div>
);

