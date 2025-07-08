import { BiMoney, BiCreditCard, BiSolidSchool, BiWallet } from 'react-icons/bi';
import { TrashBinIcon } from '../../../../assets/icons';
import type { SaleItem } from './types';
import { parsePaymentMethod } from '../../../../utils/commonFunctions';
import { Label } from '../../../../components/UI/Label/Label';

interface SaleDetailsProps {
  items: SaleItem[];
  discount: number;
  onDiscountChange: (v: number) => void;
  paymentAmount: number;
  onPaymentChange: (v: number) => void;
  paymentMethod: string;
  onMethodChange: (m: 'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos') => void;
  onAddPayment: () => void;
  onRemoveProduct: (p: string) => void;
  onReset: () => void;
  onFinish: () => void;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({
  items,
  discount,
  onDiscountChange,
  paymentAmount,
  onPaymentChange,
  paymentMethod,
  onMethodChange,
  onAddPayment,
  onRemoveProduct,
  onReset,
  onFinish,
}) => {
  // Calcular subtotal e ITBIS
  const subtotal = items.reduce((sum, it) => sum + it.producto.precioVenta * it.cantidad, 0);
  const itbis = items.reduce(
    (sum, it) => sum + (it.producto.itbis ? it.producto.precioVenta * it.cantidad * 0.18 : 0),
    0
  );

  // Total bruto antes del descuento
  const totalBruto = subtotal + itbis;

  // Validar y aplicar descuento
  const validDiscount = Math.min(Math.max(discount, 0), totalBruto);
  const totalNeto = totalBruto - validDiscount;

  // Pendiente despues del pago
  const pending = totalNeto - paymentAmount;

  return (
    <div className="flex flex-col h-full space-y-4 text-black">
      <div className="overflow-auto default-scrollbar flex-1 rounded border p-4">
        {items.map((it, i) => {
          const lineSub = it.producto.precioVenta * it.cantidad;
          const lineItb = it.producto.itbis ? lineSub * 0.18 : 0;
          const lineTot = (lineSub + lineItb).toFixed(2);
          return (
            <div key={i} className="flex justify-between mb-3 last:mb-0">
              <div>
                <div className="font-medium">{it.producto.nombre}</div>
                <div className="text-xs text-gray-500">ITBIS: RD$ {lineItb.toFixed(2)}</div>
              </div>
              <div className="font-semibold">RD$ {lineTot}</div>
              <TrashBinIcon
                className="cursor-pointer text-red-500"
                onClick={() => onRemoveProduct(it.producto._id)}
              />
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded p-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>RD$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ITBIS</span>
          <span>RD$ {itbis.toFixed(2)}</span>
        </div>

        {/** Descuento */}
        <div className="flex justify-between items-center">
          <Label>Descuento</Label>
          <input
            type="number"
            min={0}
            max={totalBruto}
            step="0.01"
            value={validDiscount.toFixed(2)}
            onChange={(e) => {
              let v = parseFloat(e.target.value) || 0;
              if (v < 0) v = 0;
              if (v > totalBruto) v = totalBruto;
              onDiscountChange(v);
            }}
            className="w-24 border rounded px-2 py-1 text-right"
          />
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>RD$ {totalNeto.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Pendiente</span>
          <span>RD$ {pending.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block" htmlFor="">
          Pago RD$
        </label>
        <input
          type="number"
          min={0}
          max={totalNeto}
          value={paymentAmount.toFixed(2)}
          onChange={(e) => {
            let val = parseFloat(e.target.value) || 0;
            if (val < 0) val = 0;
            if (val > totalNeto) val = totalNeto;
            onPaymentChange(val);
          }}
          className="w-full border rounded px-3 py-2"
        />
        <label className="block flex flex-row" htmlFor="">
          Metodo pago:&nbsp;
          <span>📌 {parsePaymentMethod(paymentMethod)}</span>
        </label>
        <div className="w-full flex flex-row gap-2 justify-around">
          <button
            className="px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300"
            onClick={() => onMethodChange('efectivo')}
          >
            <BiMoney size={24} />
          </button>
          <button
            className="px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300"
            onClick={() => onMethodChange('credito')}
          >
            <BiWallet size={24} />
          </button>
          <button
            className="px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300"
            onClick={() => onMethodChange('puntos')}
          >
            <BiSolidSchool size={24} />
          </button>
          <button
            className="px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300"
            onClick={() => onMethodChange('tarjetaCreditoDebito')}
          >
            <BiCreditCard size={24} />
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-3">
        <button onClick={onAddPayment} className="px-4 py-2 bg-yellow-400 text-white rounded-full">
          Agregar
        </button>
        <button onClick={onReset} className="px-4 py-2 border rounded-full">
          Limpiar
        </button>
        <button
          disabled={!items.length}
          onClick={onFinish}
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};
