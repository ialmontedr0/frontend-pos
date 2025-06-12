import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispath } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { clearProductError, createProduct } from '../slices/productsSlice';

import type { CreateProductDTO } from '../dtos/create-product.dto';

import { Button } from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import { Input } from '../../../components/UI/Input/Input';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { Select } from '../../../components/UI/Select/Select';

import { getAllCategories } from '../categories/slices/categoriesSlice';
import { getAllProviders } from '../providers/slices/providersSlice';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';

export const CreateProduct: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');

  const {
    product: createdProduct,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.products);
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const { providers } = useAppSelector((state: RootState) => state.providers);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateProductDTO>({
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
    dispatch(getAllCategories());
    dispatch(getAllProviders());
  }, [dispatch]);

  useEffect(() => {
    if (createdProduct) {
      navigate('/products');
    }
  }, [createdProduct, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]);

  const onSubmit = (createProductDTO: CreateProductDTO) => {
    myAlert
      .fire({
        title: 'Crear producto',
        text: `Estas seguro que deseas crear el producto?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, crear',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(createProduct(createProductDTO))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: 'Creacion producto!',
                text: `Se ha creado el producto exitosamente`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
            })
            .catch((error: any) => {
              myAlert.fire({
                title: `Error`,
                text: `Error: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar creacion',
        text: `Estas seguro que deseas cancelar la creacion del producto?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, cancelar',
        showCancelButton: true,
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(clearProductError());
          navigate('/products');
        }
      });
  };

  return (
    <div className="py-6 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800  dark:text-gray-100 mb-4">
          Crear Producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre producto"
              {...register('nombre', { required: 'El campo nombre es obligatorio' })}
            />
            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
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
                  onSelect={(id) => {
                    field.onChange(id);
                    const found = categories.find((c) => c._id === id);
                    setSelectedCategoryName(found?.nombre || 'Cargando');
                  }}
                />
              )}
            />
            {errors.categoria && <p className="text-red-600 text-sm">{errors.categoria.message}</p>}
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
                  onSelect={(id) => {
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
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea
              id="descripcion"
              placeholder="Ingresa una descripcion"
              {...register('descripcion')}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              placeholder="Ingresa el stock inicial del producto"
              {...register('stock', {
                required: 'El campo stock es obligatorio',
                valueAsNumber: true,
              })}
            />
            {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
          </div>

          <div>
            <Label htmlFor="precioCompra">Precio Compra</Label>
            <Input
              id="precioCompra"
              step="0.01"
              placeholder="Ingresa el precio de compra del producto"
              {...register('precioCompra', {
                required: 'El campo precio compra es obligatorio',
                valueAsNumber: true,
              })}
            />
            {errors.precioCompra && (
              <p className="text-red-600 text-sm">{errors.precioCompra.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="precioVenta">Precio Venta</Label>
            <Input
              id="precioVenta"
              step="0.01"
              placeholder="Ingresa el precio de venta del producto"
              {...register('precioVenta', {
                required: 'El campo precio venta es obligatorio',
                valueAsNumber: true,
              })}
            />
            {errors.precioVenta && (
              <p className="text-red-600 text-sm">{errors.precioVenta.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="itbis" className="text-gray-700 dark:text-gray-300">
              ITBIS
            </Label>
            <Select
              id="itbis"
              {...register('itbis', {
                required: 'El campo ITBIS es obligatorio',
                setValueAs: (v) => v === 'true',
              })}
              className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                        focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="true">Si</option>
              <option value="false">No</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="foto">Foto</Label>
          <Input id="foto" placeholder="foto (URL)" {...register('foto')} />
        </div>

        {error && <div className="text-red-600">Error: {error}</div>}

        <div>
          <Button type="submit">{loading ? 'Creando...' : 'Crear'}</Button>
          <Button onClick={() => cancel()} type="button" variant="default">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
