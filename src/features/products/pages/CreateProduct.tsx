import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { clearProductError, createProduct } from '../slices/productsSlice';

import type { CreateProductDTO } from '../dtos/create-product.dto';

import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import { Textarea } from '../../../components/UI/TextArea/TextArea';

import { getAllCategories } from '../categories/slices/categoriesSlice';
import { getAllProviders } from '../providers/slices/providersSlice';
import { SearchSelect } from '../../../components/SearchSelect/SearchSelect';
import PageMeta from '../../../components/common/PageMeta';
import { BiSave, BiX } from 'react-icons/bi';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';

export const CreateProduct: React.FC = () => {
  const dispatch = useAppDispatch();
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
        iconHtml: <BiSave />,
        customClass: {
          icon: 'no-default-icon-border',
        },
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
              myAlertSuccess(`Producto creado`, `Se ha creado el producto exitosamente.`);
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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
    <>
      <PageMeta title="Crear Producto - PoS v2" description="Crear Nuevo Producto" />

      <div className="p-6 space-y-6 text-black dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/** Header del component */}
          <div className="">
            <h2 className="text-3xl font-regular">Crear Producto</h2>
          </div>

          {/** Cuerpo del componente */}
          <div className="lg:grid lg:grid-cols-2 space-x-4 space-y-4">
            <div>
              <Label className="" htmlFor="">
                Nombre
              </Label>
              <Input
                id="nombre"
                placeholder="Nombre del producto"
                {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
              />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>

            <div>
              <Label className="" htmlFor="categoria">
                Categoria
              </Label>
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
                <p className="text-sm text-red-500">{errors.categoria.message}</p>
              )}
            </div>

            <div className="">
              <Label className="" htmlFor="proveedor">
                Proveedor
              </Label>
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
                <p className="text-sm text-red-500">{errors.proveedor.message}</p>
              )}
            </div>

            <div>
              <Label className="" htmlFor="descripcion">
                Descripcion
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Descripcion del producto"
                {...register('descripcion')}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion.message}</p>
              )}
            </div>

            <div>
              <Label className="" htmlFor="stock">
                Stock
              </Label>
              <Input
                id="stock"
                placeholder="Stock del producto"
                {...register('stock', {
                  required: 'El campo stock es obligatorio.',
                  valueAsNumber: true,
                  min: 0,
                })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>

            <div>
              <Label className="" htmlFor="precioCompra">
                Precio Compra
              </Label>
              <Input
                id="precioCompra"
                placeholder="Ingresa precio compra"
                {...register('precioCompra', {
                  required: 'El campo precio compra es obligatorio.',
                  valueAsNumber: true,
                })}
              />
              {errors.precioCompra && (
                <p className="text-sm text-red-500">{errors.precioCompra.message}</p>
              )}
            </div>

            <div>
              <Label className="" htmlFor="precioVenta">
                Precio Compra
              </Label>
              <Input
                id="precioVenta"
                placeholder="Ingresa precio venta"
                {...register('precioVenta', {
                  required: 'El campo precio venta es obligatorio',
                  valueAsNumber: true,
                })}
              />
              {errors.precioVenta && (
                <p className="text-sm text-red-500">{errors.precioVenta.message}</p>
              )}
            </div>

            <div className="">
              <Label className="" htmlFor="ITBIS">
                ITBIS
              </Label>
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
                      console.log(`ITBIS: `, !current);
                    }}
                    offLabel="No Aplica"
                    onLabel="Aplica"
                    className="mt-1"
                  />
                )}
              />
              {errors.itbis && <p className="text-sm text-red-500">{errors.itbis.message}</p>}
            </div>

            <div>
              <Label className="" htmlFor="foto">
                Foto
              </Label>
              <Input id="foto" placeholder="Foto (URL)" {...register('foto')} />
              {errors.foto && <p className="text-sm text-red-500">{errors.foto.message}</p>}
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
          </div>

          {/** Botones del componente */}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="primary" type="submit" startIcon={<BiSave size={20} />}>
              {loading ? `Cargando` : 'Guardar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => cancel()}
              startIcon={<BiX size={20} />}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
