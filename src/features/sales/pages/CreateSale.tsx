import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';

import type { Product } from '../../products/interfaces/ProductInterface';
import type { Customer } from '../../customers/interfaces/CustomerInterface';

import { BiTrash } from 'react-icons/bi';
import { createSale } from '../slices/salesSlice';
import { getAllCustomers } from '../../customers/slices/customerSlice';
import { getAllProducts } from '../../products/slices/productsSlice';
import { Button } from '../../../components/UI/Button/Button';

export const CreateSale: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { products } = useAppSelector((state: RootState) => state.products);
  const { customers } = useAppSelector((state: RootState) => state.customers);

  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [productQuery, setProductQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos'
  >('efectivo');

  const filteredCustomers = customers.filter((c) =>
    c.nombre.toLowerCase().includes(customerQuery.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(productQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllProducts());
  }, [dispatch]);

  const onSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setProductQuery(`${p.nombre} - stock: ${p.stock}`);
    setTempQuantity(1);
  };

  const addProduct = (product: Product) => {
    if (!selectedProduct) return;

    const existing = cart.find((item) => item.product._id === product._id);
    const alreadyQty = existing?.quantity || 0;
    const totalRequested = alreadyQty + tempQuantity;

    if (tempQuantity < 1 || totalRequested > selectedProduct.stock) {
      myAlert.fire({
        title: 'Error',
        text: `No puedes agregar mas de ${selectedProduct.stock - alreadyQty} unidades para este producto.`,
        icon: 'error',
      });
      return;
    }
    setCart((prev) => {
      const found = prev.find((item) => item.product._id === product._id);
      if (found)
        return prev.map((item) =>
          item.product._id === selectedProduct._id
            ? { ...item, quantity: item.quantity + tempQuantity }
            : item
        );
      return [...prev, { product: selectedProduct, quantity: tempQuantity }];
    });
    setSelectedProduct(null);
    setProductQuery('');
    setTempQuantity(1);
  };

  const removeProduct = (_id: string) =>
    setCart((prev) => prev.filter((item) => item.product._id !== _id));

  // Algoritmos de calculo
  const subtotalVenta = cart.reduce(
    (sum, { product, quantity }) => sum + product.precioVenta * quantity,
    0
  );
  const itbisVenta = cart.reduce(
    (sum, { product, quantity }) =>
      sum + (product.itbis ? product.precioVenta * quantity * 0.18 : 0),
    0
  );
  const totalVenta = +(subtotalVenta + itbisVenta).toFixed(2);
  const montoPendiente = +(totalVenta - paymentAmount).toFixed(2);

  /* const [createSale] = useCreateSaleMutation */

  const handleSubmit = async () => {
    console.log(paymentMethod);
    if (cart.length === 0) {
      myAlert.fire({
        title: `Error`,
        text: 'El carrito de la venta esta vacio',
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
      });
      return;
    }

    if (!selectedCustomer && !customerQuery) {
      myAlert.fire({
        title: 'Error',
        text: `Debes seleccionar al menos un cliente o ingresar un nombre`,
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
      });
      return;
    }

    dispatch(
      createSale({
        cliente: selectedCustomer?._id || customerQuery,
        productos: cart.map((i) => ({ producto: i.product._id, cantidad: i.quantity })),
        pagoVenta: paymentAmount,
        metodoPago: paymentMethod,
      })
    )
      .unwrap()
      .then(() => {
        myAlert.fire({
          title: 'Venta creada',
          text: `Se ha creado una nueva venta`,
          icon: 'success',
          timer: 5000,
          timerProgressBar: true,
        });
        setCart([]);
        setPaymentAmount(0);
        setSelectedCustomer(null);
        setCustomerQuery('');
        setSelectedProduct(null);
        setTempQuantity(1);
        navigate('/sales');
      });
  };

  return (
    <>
      <div className="flex w-full gap-4 p-4 bg-gray-100">
        {/** Izquierda */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <div className="relative mb-4 flex items-center">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {customerQuery && (
              <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                {filteredCustomers.map((c) => (
                  <li
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    key={c._id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setCustomerQuery('');
                    }}
                  >
                    {c.nombre}
                  </li>
                ))}
              </ul>
            )}
            {selectedCustomer && (
              <div>
                <p className="mt-2 font-semibold">📌 {selectedCustomer.nombre}</p>
                <Button
                  onClick={() => setSelectedCustomer(null)}
                  icon={<BiTrash size={16} />}
                ></Button>
              </div>
            )}
          </div>

          <div className="flex-grow mb-4">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setSelectedProduct(null);
              }}
              className="w-full border rounded px-3 py-2"
            />
            {productQuery && !selectedProduct && (
              <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                {filteredProducts.map((p) => (
                  <li
                    key={p._id}
                    className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => onSelectProduct(p)}
                  >
                    {p.nombre} - RD$ {p.precioVenta.toFixed(2)} (stock: {p.stock})
                  </li>
                ))}
              </ul>
            )}

            {selectedProduct && (
              <div className="mt-2">
                <p className="font-medium">
                  {selectedProduct.nombre} -- stock: {selectedProduct.stock}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="number"
                    min={1}
                    max={selectedProduct.stock}
                    value={tempQuantity}
                    onChange={(e) =>
                      setTempQuantity(Math.max(1, Math.min(selectedProduct.stock, +e.target.value)))
                    }
                    className="w-20 border rounded px-2 py-1"
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => addProduct(selectedProduct)}
                    disabled={selectedProduct.stock <= 0}
                  >
                    Agregar producto
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <label className="block font-medium">Pago (RD$)</label>
            <input
              type="number"
              value={paymentAmount}
              disabled={!cart.length}
              onChange={(e) => {
                let val = parseFloat(e.target.value) || 0;
                if (val > totalVenta) val = totalVenta;
                else if (val < 0) val = 0;
                setPaymentAmount(val);
              }}
              className="w-full border rounded px-3 py-2"
            />

            <label className="block mt-2 font-medium">Metodo pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="efectivo">Efectivo</option>
              <option value="credito">Credito</option>
              <option value="tarjetaCreditoDebito">Tarjeta</option>
              <option value="puntos">Puntos</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
          >
            Crear venta
          </button>
        </div>

        {/** Derecha */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Carrito</h2>
          <div className="overflow-auto flex-grow">
            {cart.map((item) => {
              const sub = item.product.precioVenta * item.quantity;
              const itbis = item.product.itbis ? sub * 0.18 : 0;
              const total = sub + itbis;
              return (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.product.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x RD$ {item.product.precioVenta.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Sub: RD$ {sub.toFixed(2)}</p>
                    <p>ITBIS: RD$ {itbis.toFixed(2)}</p>
                    <p>Total: RD$ {total.toFixed(2)}</p>
                  </div>
                  <BiTrash
                    size={24}
                    className="cursor-pointer text-red-500"
                    onClick={() => removeProduct(item.product._id)}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>RD$ {subtotalVenta.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>ITBIS</span>
              <span>RD$ {itbisVenta.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>RD$ {totalVenta.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pendiente</span>
              <span>RD$ {montoPendiente.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
