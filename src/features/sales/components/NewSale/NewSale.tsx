import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getAllCustomers } from '../../../customers/slices/customerSlice';
import { getAllProducts } from '../../../products/slices/productsSlice';

import { SaleHeader } from './SaleHeader';
import { Products } from './Products';
import { SaleDetails } from './SaleDetails';

import type { Customer } from '../../../customers/interfaces/CustomerInterface';
import type { Product } from '../../../products/interfaces/ProductInterface';
import type { SaleItem } from './types';
import { createSale } from '../../slices/salesSlice';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';

export const SalePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customers } = useAppSelector((state: RootState) => state.customers);
  const { products } = useAppSelector((state: RootState) => state.products);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos'
  >('efectivo');

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCustomers());
  }, [dispatch]);

  // Agregar producto al carrito de la venta
  const handleAdd = (producto: string, cantidad: number) => {
    const p = products.find((product) => product.nombre === producto);
    if (!p) return;
    setCart((cs) => {
      const idx = cs.findIndex((i) => i.producto._id === p._id);
      if (idx >= 0) {
        const next = [...cs];
        next[idx].cantidad += cantidad;
        return next;
      }
      return [...cs, { producto: p, cantidad }];
    });
    setQuantity(1);
    setProductSearch('')
  };

  // Seleccionar producto
  const handleSelect = (p: Product) => {
    setProductSearch(p.nombre);
  };

  const handleRemoveProduct = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.producto._id !== productId));
  };

  // Agregar pago
  const handleAddPayment = () => {};

  // Restablecer datos de la nueva venta
  const handleReset = () => {
    setCart([]);
    setPaymentAmount(0);
    setPaymentMethod('efectivo');
  };

  // Finalizar venta
  const handleFinish = () => {
    dispatch(
      createSale({
        cliente: selectedCustomer?._id || customerQuery,
        productos: cart.map((i) => ({ producto: i.producto._id, cantidad: i.cantidad })),
        pagoVenta: paymentAmount,
        metodoPago: paymentMethod,
      })
    )
      .unwrap()
      .then(() => {
        myAlertSuccess(`Venta creada`, `Se ha realizado la venta con exito`);
        handleReset();
        navigate('/sales');
      })
      .catch((error: any) => {
        myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
      });
  };

  // Algoritmo para calcular total de la venta
  const totalVenta = cart.reduce(
    (sum, it) => sum + it.producto.precioVenta * it.cantidad * (it.producto.itbis ? 1.18 : 1),
    0
  );

  return (
    <div className="h-screen flex flex-col">
      <SaleHeader
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        onCustomerQuery={setCustomerQuery}
        productSearch={productSearch}
        onSearchChange={setProductSearch}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAdd={handleAdd}
        total={totalVenta}
      />

      <div className="flex flex-col md:flex-row lg:flex-row md:flex-1 lg:flex-1 md:overflow-hidden lg:overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Products search={productSearch} onSelect={handleSelect} />
        </div>

        <div className="p-2 md:w-96 lg:w-96 md:p-4 lg:p-4 bg-gray-50 border-1 md:overflow-auto lg:overflow-auto">
          <SaleDetails
            items={cart}
            paymentAmount={paymentAmount}
            onPaymentChange={setPaymentAmount}
            paymentMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            onAddPayment={handleAddPayment}
            onRemoveProduct={handleRemoveProduct}
            onReset={handleReset}
            onFinish={handleFinish}
          />
        </div>
      </div>
    </div>
  );
};
