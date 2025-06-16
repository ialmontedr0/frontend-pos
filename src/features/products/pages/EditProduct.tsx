import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import {
  getProductById,
  clearSelectedProduct,
  updateProduct,
  deleteProduct,
} from '../slices/productsSlice';
import type { UpdateProductDTO } from '../dtos/update-product.dto';

import { Button } from '../../../components/UI/Button/Button';
import { Input } from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { ToggleSwitch } from '../../../components/UI/Switch/Switch';
import { BiSave, BiTrash, BiX } from 'react-icons/bi';

export const EditProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { productId } = useParams<{ productId: string }>();

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');

  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { providers } = useAppSelector((state: RootState) => state.providers);

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

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
    dispatch(getProductById(productId!));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId, navigate]);

  const onSubmit = (updateProductDTO: UpdateProductDTO) => {
    myAlert
      .fire({
        title: `Actualizar producto!`,
        text: `Estas seguro que deseas actualizar este producto?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateProduct({ productId: product!._id, updateProductDTO }))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: 'Cambios guardados!',
                text: `Se guardaron los cambios con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate('/products');
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
  };

  const onDelProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: `Eliminar producto!`,
                  text: `Se ha eliminado el producto con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/product');
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
    },
    [dispatch, navigate, myAlert]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: 'Estas seguro que deseas cancelar la edicion del prodcuto?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/products');
        }
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando datos del producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-black dark:text-white">Editar Producto</h2>
        {product.foto && (
          <div className="flex-shrink-0">
            <img
              src={
                product.foto || 'https://png.pngtree.com/element_pic/00/16/10/22580aa3ca49b8c.png'
              }
              alt={`Imagen del ${product.nombre}`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-col gap-6 items-start">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre del producto"
              {...register('nombre', { required: 'El campo nombre es obligatorio' })}
            />
            {errors.nombre && <p className="text-sm text-resd-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Controller
              name="categoria"
              control={control}
              rules={{ required: 'El campo categoria es obligatorio' }}
              render={({ field }) => (
                <SearchSelect
                  options={categories}
                  initialDisplayValue={selectedCategoryName}
                  fieldValue={field.value}
                  placeholder="Busca una categoria"
                  name={field.name}
                  onFieldChange={field.onChange}
                  onFieldBlur={field.onBlur}
                  onSelect={(id: string) => {
                    field.onChange(id);
                    const found = categories.find((c) => c._id === id);
                    setSelectedCategoryName(found?.nombre || 'Cargando');
                  }}
                />
              )}
            />
            {errors.categoria && <p className="text-sm text-red-600">{errors.categoria.message}</p>}
          </div>
          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <Controller
              name="proveedor"
              control={control}
              rules={{ required: 'El campo proveedor es obligatorio' }}
              render={({ field }) => (
                <SearchSelect
                  options={providers}
                  initialDisplayValue={selectedProviderName}
                  fieldValue={field.value}
                  placeholder="Busca un provedor"
                  name={field.name}
                  onFieldChange={field.onChange}
                  onFieldBlur={field.onBlur}
                  onSelect={(id: string) => {
                    field.onChange(id);
                    const found = providers.find((p) => p._id === id);
                    setSelectedProviderName(found?.nombre || 'Cargando');
                  }}
                />
              )}
            />
            {errors.proveedor && <p className="text-red-600 text-sm">{errors.proveedor.message}</p>}
          </div>
          <div>
            <Label htmlFor="descripcion">
              <Textarea
                id="descripcion"
                placeholder="Descripcion del producto"
                {...register('descripcion')}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-600">{errors.descripcion.message}</p>
              )}
            </Label>
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              placeholder="Stock"
              {...register('stock', {
                required: 'El campo stock es obligatorio',
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
          </div>
          <div>
            <Label htmlFor="precioCompra">Precio Compra</Label>
            <Input
              id="precioCompra"
              placeholder="Precio Compra RD$"
              {...register('precioCompra', {
                required: 'El campo precio venta es obligatorio',
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.precioCompra && (
              <p className="text-sm text-red-600">{errors.precioCompra.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="precioVenta">Precio Venta</Label>
            <Input
              id="precioVenta"
              placeholder="Precio Venta RD$"
              {...register('precioVenta', {
                required: 'El campo precio venta es obligatorio',
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.precioVenta && (
              <p className="text-red-600 text-sm">{errors.precioVenta.message}</p>
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
                <ToggleSwitch
                  enabled={field.value ?? false}
                  onClick={() => {
                    const current = field.value ?? false;
                    field.onChange(!current);
                    console.log(current);
                  }}
                  offLabel="No Aplica"
                  onLabel="Aplica"
                  className="mt-1"
                />
              )}
            />
            {errors.itbis && <p className="text-sm text-red-600">{errors.itbis.message}</p>}
          </div>

          <div>
            <Label htmlFor="foto">Foto</Label>
            <Input id="foto" placeholder="Foto (URL)" {...register('foto')} />
            {errors.foto && <p className="text-sm text-red-600">{errors.foto.message}</p>}
          </div>

          {error && <div className="text-red-600">Error: {error}</div>}

          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <Button icon={<BiSave size={20} />} type="submit" className="">
              Guardar
            </Button>
            <Button
              icon={<BiTrash size={20} />}
              type="button"
              variant="destructive"
              onClick={() => onDelProduct(product._id)}
            >
              Eliminar
            </Button>
            <Button icon={<BiX size={20} />} type="button" variant="outline" onClick={cancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
