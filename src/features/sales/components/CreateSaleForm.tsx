import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getAllProducts } from '../../products/slices/productsSlice';
import { getAllCustomers } from '../../customers/slices/customerSlice';

import type { Product } from '../../products/interfaces/ProductInterface';
import type { Customer } from '../../customers/interfaces/CustomerInterface';
import { createSale } from '../slices/salesSlice';
import type { CreateSaleDTO } from '../dtos/create-sale.dto';

import { Label } from '../../../components/UI/Label/Label';
import  Input  from '../../../components/UI/Input/Input';
import { BiTrash } from 'react-icons/bi';


interface LineItem {
  product: Product;
  quantity: number;
  subtotalProducto: number;
  itbisProducto: number;
  totalProducto: number;
}

export const CreateSaleForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { products } = useAppSelector((state: RootState) => state.products);
  const allCustomers = useAppSelector((state: RootState) => state.customers.customers);

  const [customerQuery, setCustomerQuery] = useState<string>('');
  const filteredCustomers = allCustomers.filter((c) =>
    c.nombre.toLowerCase().includes(customerQuery.toLowerCase())
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [productQuery, setProductQuery] = useState<string>('');
  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(productQuery.toLowerCase())
  );
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [pagoVenta, setPagoVenta] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<
    'efectivo' | 'credito' | 'tarjetaCreditoDebito' | 'puntos'
  >('efectivo');

  // Totales === Algoritmos
  const subtotalVenta = lineItems.reduce((sum, li) => sum + li.subtotalProducto, 0);
  const itbisVenta = lineItems.reduce((sum, li) => sum + li.itbisProducto, 0);
  const totalVenta = +(subtotalVenta + itbisVenta).toFixed(2);
  const montoPendiente = +(totalVenta - pagoVenta).toFixed(2);

  // Buscar clientes y productos
  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCustomers());
  }, [dispatch]);

  /* useEffect(() => {
    if (productQuery.length >= 2) {
      getProductsByNameOrCode(productQuery).then(setProductResults);
    }
  }, [productQuery]); */

  const addProduct = (p: Product) => {
    if (lineItems.find((li) => li.product._id === p._id)) return;
    setLineItems([
      ...lineItems,
      {
        product: p,
        quantity: 1,
        subtotalProducto: p.precioVenta,
        itbisProducto: p.itbis ? +(p.precioVenta * 0.18).toFixed(2) : 0,
        totalProducto: +(p.precioVenta * (1 + (p.itbis ? 0.18 : 0))).toFixed(2),
      },
    ]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    setLineItems((items) =>
      items.map((li, i) => {
        if (i !== index) return li;
        const sp = +(li.product.precioVenta * quantity).toFixed(2);
        const it = li.product.itbis ? +(sp * 0.18).toFixed(2) : 0;
        return {
          ...li,
          quantity: quantity,
          subtotalProducto: sp,
          itbisProducto: it,
          totalProducto: +(sp + it).toFixed(2),
        };
      })
    );
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || lineItems.length === 0) return;
    const createSaleDTO: CreateSaleDTO = {
      cliente: selectedCustomer._id,
      productos: lineItems.map((li) => ({ producto: li.product._id, cantidad: li.quantity })),
      pagoVenta,
      metodoPago,
    };

    try {
      myAlert
        .fire({
          title: `Nueva venta`,
          text: `Estas seguro que deseas crear la nueva venta?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(createSale(createSaleDTO))
              .then(() => {
                myAlert.fire({
                  title: 'Venta creada',
                  text: `Se ha creado la venta con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/sales/create');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    } catch (error: any) {
      myAlert.fire({
        title: `Error`,
        text: `Error: ${error.response?.data?.message || error.message}`,
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div>
      <h2>Nueva venta</h2>
      <div>
        <Label htmlFor="cliente">Cliente</Label>
        <Input
          value={customerQuery}
          onChange={(e) => setCustomerQuery(e.target.value)}
          placeholder="Buscar cliente..."
        />
        {filteredCustomers.map((c) => (
          <div key={c._id} onClick={() => setSelectedCustomer(c)}>
            {c.nombre}
          </div>
        ))}
        <p>Cliente: {selectedCustomer?.nombre || '-'}</p>
      </div>

      <div>
        <Label htmlFor="productos">Productos</Label>
        <Input
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          placeholder="Buscar producto..."
        />
        {filteredProducts.map((p) => (
          <div key={p._id} onClick={() => addProduct(p)}>
            {p.nombre} RD$ {p.precioVenta.toFixed(2)}
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>ITBIS</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((li, i) => (
            <tr key={li.product._id}>
              <td>{li.product.nombre}</td>
              <td>
                <input
                  type="number"
                  value={li.quantity}
                  min={1}
                  onChange={(e) => updateQuantity(i, +e.target.value)}
                />
              </td>
              <td>RD$ {li.subtotalProducto.toFixed(2)}</td>
              <td>RD$ {li.itbisProducto.toFixed(2)}</td>
              <td>RD$ {li.totalProducto.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <p>Subtotal: RD$ {subtotalVenta.toFixed(2)}</p>
        <p>ITBIS: RD$ {itbisVenta.toFixed(2)}</p>
        <p>Total: RD${totalVenta.toFixed(2)}</p>
      </div>

      <div>
        <Label htmlFor="pagoVenta">Pago venta</Label>
        <Input
          type="number"
          value={pagoVenta}
          min={0}
          max={totalVenta}
          onChange={(e) => setPagoVenta(+e.target.value)}
        />
      </div>
      <p>Monto Pendiente: RD$ {montoPendiente.toFixed(2)}</p>

      <div>
        <Label htmlFor="metodoPago">Metodo Pago</Label>
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value as any)}>
          <option value="efectivo">Efectivo</option>
          <option value="credito">Credito</option>
          <option value="tarjetaCreditoDebito">Tarjeta</option>
          <option value="puntos">Puntos</option>
        </select>
      </div>

      <button type="button" onClick={handleSubmit}>
        Crear venta
      </button>
    </div>
  );
};
