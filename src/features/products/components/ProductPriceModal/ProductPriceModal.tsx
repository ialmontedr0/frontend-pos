import React, { useEffect, useState } from 'react';
import { ModalPortal } from '../../../../components/ModalPortal/ModalPortal';
import type { Product } from '../../interfaces/ProductInterface';
import  Button  from '../../../../components/UI/Button/Button';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  actionType: 'updateCost' | 'updateSale';
  onConfirm: (value: number) => void;
}

export const ProductPriceModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  actionType,
  onConfirm,
}) => {
  const [inputValue, setInputValue] = useState<number>(0);

  useEffect(() => {
    setInputValue(actionType === 'updateCost' ? product.precioCompra : product.precioVenta);
  }, [product, actionType]);

  if (!isOpen) return null;

  const title =
    actionType === 'updateCost' ? 'Actualizar Precio Compra' : 'Actualizar Precio Venta';

  const handleConfirm = () => {
    onConfirm(inputValue);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-2 mb-4">
          <p>
            Codigo:<strong> {product.codigo}</strong>
          </p>
          <p>
            Nombre: <strong>{product.nombre}</strong>
          </p>
          <p>
            Precio Compra: <strong>{product.precioCompra}</strong>
          </p>
          <p>
            Precio Venta: <strong>{product.precioVenta}</strong>
          </p>
          <p>
            ITBIS: <strong>{product.itbis ? 'Si' : 'No'}</strong>
          </p>
          <p>
            Stock: <strong>{product.stock}</strong>
          </p>
          <p>
            Disponible: <strong>{product.disponible ? 'Si' : 'No'}</strong>
          </p>
        </div>
        <div className="flex items-center mb-4">
          <label className="w-1/3 font-medium">
            {actionType === 'updateCost' ? 'Nuevo Precio compra' : 'Nuevo precio venta'}
          </label>

          <input
            type="number"
            className="border rounded px-2 py-1 flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Guardar</Button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
