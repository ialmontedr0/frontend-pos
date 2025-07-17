import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import { getCategoryById, clearSelectedCategory } from '../slices/categoriesSlice';
import type { RootState } from '../../../../store/store';
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrum from '../../../../components/common/PageBreadCrumb';
import { Label } from '../../../../components/UI/Label/Label';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit } from 'react-icons/bi';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { NotFound } from '../../../../pages/NotFound';
import { useModal } from '../../../../hooks/useModal';
import { EditCategory } from '../components/EditCategory';

export const Category: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const { categoryId } = useParams<{ categoryId: string }>();
  moment.locale('es');

  const { category, loading, error } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    if (!categoryId) {
      navigate('/products/categories');
      return;
    }
    dispatch(getCategoryById(categoryId));
    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, categoryId, navigate]);

  const back = () => {
    navigate(-1);
  };

  const onEditCategory = () => {
    openModal();
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!category) {
    return <NotFound node="Categoria" />;
  }

  return (
    <>
      <PageMeta title="Categoria - PoS v2" description="Detalles de la categoria" />
      <PageBreadcrum pageTitle="Categoria" />
      <div className="shadow-theme-sm m-4 border border-black rounded-lg h-full p-4 space-y-6">
        <div className="">
          <h2 className="text-2xl md:text-3xl font-regular">Categoria</h2>
        </div>

        <div className="grid grid-cols-2 md:flex-col sm:flex-col xs:flex-col space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <p>{category.nombre}</p>
          </div>

          <div>
            <Label htmlFor="createdBy">Creada por</Label>
            <p>{category.createdBy.usuario}</p>
          </div>

          <div>
            <Label htmlFor="createdAt">Fecha Creacion</Label>
            <p>{moment(category.createdAt).format('LLLL')}</p>
          </div>

          {category.updatedBy && (
            <div>
              <Label htmlFor="updatedBy">Actualizada por</Label>
              <p>{category.updatedBy.usuario}</p>
            </div>
          )}

          {category.updatedAt && (
            <div>
              <Label htmlFor="updatedAt">Fecha Actualizacion</Label>
              <p>{moment(category.updatedAt).format('LLLL')}</p>
            </div>
          )}
        </div>

        <div className="my-4 flex flex-wrap gap-2 justify-center md:justify-end">
          <Button size="sm" variant="outline" startIcon={<BiArrowBack />} onClick={back}>
            Volver
          </Button>
          <Button size="sm" variant="primary" startIcon={<BiEdit />} onClick={onEditCategory}>
            Editar
          </Button>
        </div>
        <EditCategory isOpen={isOpen} closeModal={closeModal} category={category} error={error!} />
      </div>
    </>
  );
};
