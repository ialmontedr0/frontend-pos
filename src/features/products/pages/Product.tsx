import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getProductById, deleteProduct, clearSelectedProduct } from '../slices/productsSlice';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import Badge from '../../../components/UI/Badge/Badge';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiTrash } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import { Label } from '../../../components/UI/Label/Label';

export function Product() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!productId) {
      navigate('/products');
      return;
    }
    dispatch(getProductById(productId));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId, navigate]);

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      myAlert
        .fire({
          title: 'Eliminar producto',
          text: `Estas seguro que deseas eliminar este producto?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProduct(productId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Producto eliminado`, `Se ha eliminado el producto exitosamente`);
                navigate('/products');
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, navigate]
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => navigate('/products')}
        >
          Volver
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-2-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Producto no encontrado</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-200 rounded hover:bg-gray-200 dakr:hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }
  return (
    <>
      <PageMeta title={product.nombre} description="Detalles producto" />
      <div className="p-4 space-y-6 border-2 border-black h-full max-h-full sm:h-full sm:max-h-auto">
        <div className='border-2 border-green-600 m-6 p-4 md:h-auto md:max-h-full sm:h-full'>
          <div className="space-y-4">
            <h2 className="text-3xl font-regular">{product.nombre}</h2>
          </div>

          <div className="lg:flex lg:flex-row md:flex-col">
            <div className="border border-black w-fit mr-4">
              <img src={product.foto} className="rounded-full" alt="" />
            </div>

            <div className="">
              <div className="lg:grid lg:grid-cols-2 space-x-4">
                <div className="">
                  <Label htmlFor="codigo">Codigo</Label>
                  <p>{product.codigo}</p>
                </div>

                <div className="">
                  <Label htmlFor="categoria">Categoria</Label>
                  <p>{product.categoria.nombre}</p>
                </div>

                <div className="">
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <p>{product.proveedor.nombre}</p>
                </div>

                <div className="">
                  <Label htmlFor="precioCompra">Precio Compra</Label>
                  <p>RD$ {product.precioCompra.toFixed(2)}</p>
                </div>

                <div className="">
                  <Label htmlFor="precioVenta">Precio Venta</Label>
                  <p>RD$ {product.precioVenta.toFixed(2)}</p>
                </div>

                <div className="">
                  <Label htmlFor="itbis">ITBIS</Label>
                  <p>{product.itbis === true ? 'Aplica' : 'No Aplica'}</p>
                </div>

                <div className="">
                  <Label htmlFor="stock">Stock</Label>
                  <p>{product.stock}</p>
                </div>

                <div className="">
                  <Label htmlFor="estado">Estado</Label>
                  {product.disponible === true ? (
                    <Badge color="success">Disponible</Badge>
                  ) : (
                    <Badge color="error">No Disponible</Badge>
                  )}
                </div>

                <div className="">
                  <Label htmlFor="soldCount">Unidades vendidas</Label>
                  <p>{product.soldCount}</p>
                </div>

                <div className="">
                  <Label htmlFor="createdBy">Creado por</Label>
                  <p>{product.createdBy!.usuario}</p>
                </div>

                <div className="">
                  <Label htmlFor="">Fecha creacion</Label>
                  <p>{moment(product.createdAt).format('LLLL')}</p>
                </div>

                {product.updatedBy && (
                  <div className="">
                    <Label htmlFor="updatedBy">Actualizado por</Label>
                    <p>{product.updatedBy.usuario}</p>
                  </div>
                )}

                {product.updatedAt && (
                  <div className="">
                    <Label htmlFor="updatedAt">Fecha actualizacion</Label>
                    <p>{moment(product.updatedAt).format('LLLL')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex lg:justify-end gap-2 my-4 md:justify-center">
            <Button
              onClick={() => navigate('/products')}
              size="sm"
              startIcon={<BiArrowBack size={20} />}
              variant="primary"
            >
              Volver
            </Button>
            <Button
              onClick={() => navigate(`/products/edit/${product._id}`)}
              size="sm"
              startIcon={<BiEdit size={20} />}
              variant="outline"
            >
              Editar
            </Button>
            <Button
              onClick={() => handleDeleteProduct(product._id)}
              size="sm"
              startIcon={<BiTrash size={20} />}
              variant="destructive"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
