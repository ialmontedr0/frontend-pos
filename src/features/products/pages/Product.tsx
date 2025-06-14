import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import { getProductById, deleteProduct, clearSelectedProduct } from '../slices/productsSlice';

import type { User } from '../../users/interfaces/UserInterface';
import { usersService } from '../../users/services/usersService';

import type { Provider } from '../providers/interfaces/ProviderInterface';
import type { Category } from '../categories/interfaces/CategoryInterface';

export function Product() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const [creator, setCreator] = useState<User | null>(null);
  const [updater, setUpdater] = useState<User | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { product, loading, error } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!productId) {
      navigate('/products');
      return;
    }
    dispatch(getProductById(productId));
    return () => {
      dispatch(clearSelectedProduct());
      setCreator(null);
      setUpdater(null);
      setFetchError(null);
    };
  }, [dispatch, productId, navigate]);

  useEffect(() => {
    if (!product) return;

    setFetchError(null);
    const loadById = async (userId: string, setter: (u: User | null) => void) => {
      try {
        const userResponse = await usersService.getById(userId);
        setter(userResponse.data);
      } catch (error: any) {
        setter(null);
        setFetchError(
          `No se pudo obtener el usuario con el ID: ${userId}: ${error.response?.data?.message || error.message}`
        );
      }
    };

    if (product.createdBy) {
      loadById(product.createdBy, setCreator);
    }

    if (product.updatedBy) {
      loadById(product.updatedBy, setUpdater);
    }

    if (typeof product.categoria === 'object') {
      setCategory(product.categoria as Category);
    }

    if (typeof product.proveedor === 'object') {
      setProvider(product.proveedor as Provider);
    }
  }, [product]);

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
                myAlert.fire({
                  title: 'Eliminar producto',
                  text: `Se ha eliminado el producto con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/products');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, navigate]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando producto...</p>
      </div>
    );
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
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
          <img
            src={product.foto || 'https://png.pngtree.com/element_pic/00/16/10/22580aa3ca49b8c.png'}
            alt={`Imagen del ${product.nombre}`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
          />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {product.nombre}
        </h2>

        <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Codigo</p>
            <p className="text-gray-800 dark:text-gray-200">{product.codigo}</p>
          </div>

          {category && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Categoria</p>
              <p className="text-gray-800 dark:text-gray-200">
                {category!.nombre || 'Cargando...'}
              </p>
            </div>
          )}

          {provider && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Proveedor</p>
              <p className="text-gray-800 dark:text-gray-200">
                {provider!.nombre || 'Cargando...'}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Descripcion</p>
            <fieldset className="text-gray-800 dark:text-gray-200">{product.descripcion}</fieldset>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Stock</p>
            <p className="text-gray-800 dark:text-gray-200">{product.stock}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Estado</p>
            <p
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                product.disponible === true
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {product.disponible === true ? 'Disponible' : 'No disponible'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Precio compra</p>
            <p className="text-gray-800 dark:text-gray-200">
              RD$ {product.precioCompra.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Precio venta</p>
            <p className="text-gray-800 dark:text-gray-200">RD$ {product.precioVenta.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">ITBIS</p>
            <p className="text-gray-800 dark:text-gray-200">
              {product.itbis === true ? 'Si' : 'No'}
            </p>
          </div>

          {product.createdBy && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Creado por</p>
              <p className="text-gray-800 dark:text-gray-200">
                {creator ? `${creator.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}

          {product.updatedBy && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</p>
              <p className="text-gray-800 dark:text-gray-200">
                {updater ? `${updater.usuario}` : 'Cargando...'}
              </p>
            </div>
          )}

          {fetchError && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
          )}

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(product.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Ultima actualizacion</p>
            <p className="text-gray-800 dark:text-gray-200">
              {moment(product.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => navigate('/products')}
            >
              ← Volver
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={() => navigate(`/products/edit/${product._id}`)}
            >
              Editar
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition"
              onClick={() => handleDeleteProduct(product._id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
