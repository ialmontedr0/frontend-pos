import { useState } from 'react';
import { SaleHeader } from './SaleHeader';
import { Products } from './Products';
import { SaleDetails } from './SaleDetails';
import type { Product } from '../../../products/interfaces/ProductInterface';
import type { SaleItem } from './types';

const products: Product[] = [
  {
    codigo: '1',
    _id: '1',
    nombre: 'Arroz',
    precioCompra: 5,
    precioVenta: 10,
    stock: 10,
    foto: 'http://img.png',
    categoria: 'Comida',
    proveedor: 'Proveedor',
    itbis: true,
    disponible: true,
  },
];

export const SalePage: React.FC = () => {
  const [customer, setCustomer] = useState('Cliente');
  const [search, setSearch] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const [cart, setCart] = useState<SaleItem[]>([]);

  const handleAdd = () => {
    const p = products.find((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));
    if (!p) return;

    setCart((cs) => {
      const index = cs.findIndex((c) => c.producto._id === p._id);
      if (index >= 0) {
        const next = [...cs];
        next[index].cantidad += quantity;
        return next;
      }
      return [...cs, { producto: p, cantidad: quantity }];
    });
    setQuantity(1);
  };

  const handleSelectProduct = (p: Product) => {
    setSearch(p.nombre);
  };

  const handleQuantityChange = (i: number, q: number) => {
    setCart((cs) => {
      const next = [...cs];
      next[i].cantidad = q;
      return next;
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <SaleHeader
        customer={customer}
        onCustomerChange={setCustomer}
        productSearch={search}
        onSearchChange={setSearch}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddClick={handleAdd}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Products onSelectProduct={handleSelectProduct} />
        </div>
        <div className="w-96 p-4 bg-gray-50 dark:bg-[#1d2939] border-l overflow-auto">
          <SaleDetails items={cart} onQtyChange={handleQuantityChange} />
        </div>
      </div>
    </div>
  );
};
