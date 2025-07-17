import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';
import Button from '../../../components/UI/Button/Button';
import { BiSave, BiTrash, BiX } from 'react-icons/bi';
import type { Product } from '../interfaces/ProductInterface';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import type { UpdateProductDTO } from '../dtos/update-product.dto';
import { useCallback, useEffect, useState } from 'react';
import type { RootState } from '../../../store/store';
import { deleteProduct, getProductByCode, updateProduct } from '../slices/productsSlice';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';

interface EditProductProps {
  product: Product;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditProduct: React.FC<EditProductProps> = ({ product, isOpen, closeModal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');

  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { providers } = useAppSelector((state: RootState) => state.providers);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateProductDTO>({
    defaultValues: {
      nombre: '',
      categoria: '',
      descripcion: '',
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
      itbis: true,
      proveedor: '',
      foto: '',
    },
  });

  useEffect(() => {
    if (product) {
      const catId =
        (typeof product.categoria === 'object' ? product.categoria._id : product.categoria) || '';

      const provId =
        (typeof product.proveedor === 'object' ? product.proveedor._id : product.proveedor) || '';

      reset({
        nombre: product.nombre,
        categoria: catId,
        descripcion: product.descripcion,
        stock: product.stock,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        itbis: product.itbis ?? false,
        proveedor: provId,
        foto: product.foto,
      });

      setSelectedCategoryName(
        typeof product.categoria === 'object'
          ? product.categoria.nombre
          : categories.find((c) => c._id === catId)?.nombre || ''
      );

      setSelectedProviderName(
        typeof product.proveedor === 'object'
          ? product.proveedor.nombre
          : providers.find((p) => p._id === provId)?.nombre || ''
      );
    }
  }, [product, categories, providers, reset]);

  useEffect(() => {
    if (!product) return;

    return () => {};
  }, [product]);

  const onSubmit = useCallback(
    (updateProductDTO: UpdateProductDTO) => {
      myAlert
        .fire({
          title: 'Guardar cambios!',
          text: 'Estas seguro que deseas guardar estos cambios?',
          iconHtml: <BiSave />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && product) {
            dispatch(
              updateProduct({
                productId: product!._id,
                updateProductDTO,
              })
            )
              .unwrap()
              .then(() => {
                closeModal();
                myAlertSuccess(
                  `Producto actualizado`,
                  `Se ha actualizado el producto exitosamente.`
                );
                getProductByCode(product.codigo);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          iconHtml: <BiTrash color='red' />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: 'red',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Producto Eliminado`, `Se ha eliminado el producto exitosamente.`);
                navigate('/products');
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, navigate, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar',
        text: `Estas seguro que deseas cancelar la edicion del producto?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Continuar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (!product) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] mx-4 md:mx-auto">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Producto
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos del producto
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                  {product.nombre}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                      placeholder={product.nombre}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Controller
                      name="categoria"
                      control={control}
                      rules={{ required: 'El campo categoria es obligatorio.' }}
                      render={({ field }) => (
                        <SearchSelect
                          options={categories}
                          initialDisplayValue={selectedCategoryName}
                          fieldValue={field.value}
                          placeholder="Buscar categoria..."
                          name={field.name}
                          onFieldChange={field.onChange}
                          onFieldBlur={field.onBlur}
                          onSelect={(id: string) => {
                            field.onChange(id);
                            const found = categories.find((c) => c._id === id);
                            setSelectedCategoryName(found?.nombre || '');
                          }}
                        />
                      )}
                    />
                    {errors.categoria && (
                      <div className="text-sm text-red-500">{errors.categoria.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripcion</Label>
                    <Input
                      id="descripcion"
                      placeholder={product.descripcion}
                      {...register('descripcion')}
                    />
                    {errors.descripcion && (
                      <div className="text-sm text-red-500">{errors.descripcion.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      type="number"
                      id="stock"
                      {...register('stock', {
                        required: 'El campo stock es obligatorio',
                        valueAsNumber: true,
                        min: 0,
                      })}
                    />
                    {errors.stock && (
                      <div className="text-sm text-red-500">{errors.stock.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="precioCompra">Precio Compra</Label>
                    <Input
                      type="number"
                      id="precioCompra"
                      {...register('precioCompra', {
                        required: 'El campo precio compra es obligatorio',
                        valueAsNumber: true,
                        min: 0,
                      })}
                    />
                    {errors.precioCompra && (
                      <div className="text-sm text-red-500">{errors.precioCompra.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="precioVenta">Precio Venta</Label>
                    <Input
                      type="number"
                      id="precioVenta"
                      {...register('precioVenta', {
                        required: 'El campo precio venta es obligatorio',
                        valueAsNumber: true,
                        min: 0,
                      })}
                    />
                    {errors.precioVenta && (
                      <div className="text-sm text-red-500">{errors.precioVenta.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Controller
                      name="proveedor"
                      control={control}
                      rules={{ required: 'El campo proveedor es obligatorio.' }}
                      render={({ field }) => (
                        <SearchSelect
                          options={providers}
                          initialDisplayValue={selectedProviderName}
                          fieldValue={field.value}
                          placeholder="Buscar proveedor..."
                          name={field.name}
                          onFieldChange={field.onChange}
                          onFieldBlur={field.onBlur}
                          onSelect={(id: string) => {
                            field.onChange(id);
                            const found = providers.find((p) => p._id === id);
                            setSelectedProviderName(found?.nombre || '');
                          }}
                        />
                      )}
                    />
                    {errors.proveedor && (
                      <div className="text-sm text-red-500">{errors.proveedor.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="itbis">ITBIS</Label>
                    <Controller
                      name="itbis"
                      control={control}
                      rules={{
                        validate: {
                          isBoolean: (v) => v === true || v === false,
                        },
                      }}
                      render={({ field }) => (
                        <ToggleSwitch<boolean>
                          value={field.value ?? false}
                          offValue={false}
                          onValue={true}
                          onToggle={(v) => field.onChange(v)}
                          offLabel="No"
                          onLabel="Si"
                          className="mt-1"
                        />
                      )}
                    />
                    {errors.itbis && (
                      <div className="text-sm text-red-500">{errors.itbis.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-2 mt-6 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash />}
                onClick={() => onDelProduct(product._id)}
              >
                Eliminar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
