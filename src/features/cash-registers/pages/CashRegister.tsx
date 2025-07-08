import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment/min/moment-with-locales';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import {
  getCashRegisterByCode,
  deleteCashRegister,
  clearSelectedCashRegister,
  closeCashRegister,
  openCashRegister,
  assignCashRegisterToUser,
  clearCashRegisterError,
} from '../slices/cashRegisterSlice';
import { getAllUsers } from '../../users/slices/usersSlice';

import { Label } from '../../../components/UI/Label/Label';
import type { Transaction } from '../interfaces/TransactionInterface';
import type { Action, Column } from '../../../components/Table/types';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { Table } from '../../../components/Table/Table';
import { BiArrowBack, BiCollapse, BiEdit, BiFolderOpen, BiTrash } from 'react-icons/bi';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import type { User } from '../../users/interfaces/UserInterface';
import Badge from '../../../components/UI/Badge/Badge';
import Button from '../../../components/UI/Button/Button';
import { UserIcon } from '../../../assets/icons';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';

export const CashRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');

  const { users } = useAppSelector((state: RootState) => state.users);

  let openAmount: number = 0;
  let closeAmount: number = 0;

  const { codigo } = useParams<{ codigo: string }>();

  const { cashRegister, loading, error } = useAppSelector(
    (state: RootState) => state.cashRegisters
  );

  const transactionColumns: Column<Transaction>[] = [
    {
      header: 'Tipo',
      accessor: 'tipo',
      render: (value: string) => `${value.charAt(0).toUpperCase() + value.slice(1)}`,
    },
    { header: 'Monto', accessor: 'monto', render: (value: number) => `RD$ ${value.toFixed(2)}` },
    {
      header: 'Usuario',
      accessor: 'usuario',
      render: (value: { _id: string; usuario: string } | null) => (value ? value.usuario : '-'),
    },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${moment(value).format('DD/MM/YYYY hh:mm a')}`,
    },
  ];

  const transactionActions: Action<Transaction>[] = [
    { label: 'Ver', onClick: (t) => navigate(`/transactions/${t._id}`) },
  ];

  // efecto
  useEffect(() => {
    if (!codigo) {
      navigate('/cash-registers');
      return;
    }
    dispatch(getCashRegisterByCode(codigo));
    dispatch(getAllUsers());
    return () => {
      dispatch(clearSelectedCashRegister());
    };
  }, [dispatch, codigo, navigate]);

  const back = () => {
    navigate('/cash-registers');
  };

  const editRegister = (codigo: string) => {
    navigate(`/cash-registers/edit/${codigo}`);
  };

  const openRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: `Abrir caja`,
          text: `Seguro que deseas abrir esta caja?`,
          icon: 'question',
          input: 'number',
          inputValue: openAmount,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Abrir',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            openAmount = Number(result.value);
            dispatch(
              openCashRegister({
                cashRegisterId: registerId,
                openRegisterDTO: {
                  montoApertura: openAmount,
                },
              })
            )
              .unwrap()
              .then(() => {
                myAlertSuccess(`Caja abierta`, `Se ha abierto la caja exitosamente!`);
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, myAlert, openAmount]
  );

  const closeRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: 'Cerrar caja',
          text: `Seguro que deseas cerrar esta caja?`,
          icon: 'question',
          input: 'number',
          inputValue: closeAmount,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            closeAmount = Number(result.value);
            dispatch(
              closeCashRegister({
                cashRegisterId: registerId,
                closeRegisterDTO: {
                  montoCierre: closeAmount,
                },
              })
            );
          }
        });
    },
    [dispatch, myAlert, closeAmount]
  );

  const onDelRegister = useCallback(
    (cashRegisterId: string) => {
      myAlert
        .fire({
          title: `Cerrar caja!`,
          text: `Estas seguro que deseas eliminar esta caja?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCashRegister(cashRegisterId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Caja eliminada!',
                  text: `Se ha eliminado la caja con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
              })
              .catch((error: any) => {
                myAlertError('Error', `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, myAlert]
  );

  const handleAssignToUser = () => {
    let internalSelected: User | null = null;

    // Helper para actualizar la lista de resultados
    function renderResults(q: string, resultsEl: HTMLUListElement) {
      const matched = users.filter((u) => u.usuario.toLowerCase().includes(q.toLowerCase()));
      resultsEl.innerHTML = '';

      matched.forEach((u) => {
        const li = document.createElement('li');
        li.textContent = u.usuario;
        li.style.cssText = 'padding:5px;cursor:pointer';
        li.onclick = () => {
          internalSelected = u;
          Array.from(resultsEl.children).forEach((c) =>
            (c as HTMLElement).classList.remove('swal-selected')
          );
          li.classList.add('swal-selected');
        };
        resultsEl.appendChild(li);
      });
    }

    myAlert
      .fire({
        title: 'Asignar a Usuario',
        text: `Ingresa el usuario al que deseas asignar la caja`,
        html: `
        <input 
          id='swal-input'
          class='swal2-input'
          placeholder='Buscar usuario'
        />
          <ul id='swal-results' style='text-aligh: left; max-height: 150px; overflow-y-auto; margin:0; padding:0; list-style:none;'></ul>
        `,
        preConfirm: () => {
          if (!internalSelected) {
            Swal.showValidationMessage(`Debes seleccionar un usuario`);
          }
          return internalSelected;
        },
        willOpen: () => {
          const popup = Swal.getPopup()!;
          const input = popup.querySelector<HTMLInputElement>('#swal-input')!;
          const resultsEl = popup.querySelector<HTMLUListElement>('#swal-results')!;

          input.addEventListener('input', () => {
            renderResults(input.value, resultsEl);
          });

          renderResults('', resultsEl);
        },
        customClass: {
          validationMessage: 'm-1 text-red-600',
        },
      })
      .then((result) => {
        if (result.isConfirmed && result.value && cashRegister) {
          const user = result.value as User;
          dispatch(
            assignCashRegisterToUser({
              userId: user._id,
              registerId: cashRegister._id,
            })
          )
            .unwrap()
            .then(() => {
              myAlertSuccess('Usuario asignado', `Se ha asignado el usuario con exito.`);
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              dispatch(clearCashRegisterError());
            });
        }
      });
  };

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (!cashRegister) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No existe la caja</p>
        <button>Volver</button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Caja Registradora - PoS v2" description="Caja " />
      <PageBreadcrum pageTitle="Caja" />
      <div className="h-full space-y-6 m-2 p-4 md:mx-auto bg-white rounded-xl dark:bg-gray-900 max-w-full text-black dark:text-gray-300">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-regular">Detalles de la caja</h2>
        </div>
        <div className="grid grid-cols-2 space-y-2">
          <div>
            <Label htmlFor="codigo">Caja</Label>
            <p>{cashRegister.codigo}</p>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            {cashRegister.estado === 'abierta' ? (
              <Badge color="success">Abierta</Badge>
            ) : (
              <Badge color="warning">Cerrada</Badge>
            )}
          </div>

          <div>
            <Label htmlFor="montoApertura">Monto Apertura</Label>
            <p>RD$ {cashRegister.montoApertura?.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="montoActual">Monto Actual</Label>
            <p>RD$ {cashRegister.montoActual.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="montoCierre">Monto Cierre</Label>
            <p>RD$ {cashRegister.montoCierre?.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="diferencia">Diferencia</Label>
            <p>RD$ {cashRegister.diferencia?.toFixed(2)}</p>
          </div>

          {cashRegister.createdBy && (
            <div>
              <Label htmlFor="createdBy">Creada por</Label>
              <p>{cashRegister.createdBy.usuario}</p>
            </div>
          )}

          {cashRegister.assignedTo && (
            <div>
              <Label htmlFor="assignedTo">Cajero asignado</Label>
              <p>{cashRegister.assignedTo.usuario}</p>
            </div>
          )}

          {cashRegister.openBy && cashRegister.openAt && (
            <>
              <div>
                <Label htmlFor="openBy">Abierta por</Label>
                <p>{cashRegister.openBy.usuario}</p>
              </div>
              <div>
                <Label htmlFor="openAt">Fecha</Label>
                <p>{moment(cashRegister.openAt).format('llll')}</p>
              </div>
            </>
          )}

          {cashRegister.closedBy && cashRegister.closedAt && (
            <div>
              <Label htmlFor="closedBy">Cerrada por</Label>
              <p>{cashRegister.closedBy.usuario}</p>

              <Label htmlFor="closedAt">Fecha cierre</Label>
              <p>{moment(cashRegister.closedAt).format('llll')}</p>
            </div>
          )}

          <div>
            <Label htmlFor="createdAt">Fecha Creacion</Label>
            <p>{moment(cashRegister.createdAt).format('llll')}</p>
          </div>
          
          {cashRegister.updatedBy && (
            <div>
              <Label htmlFor="updatedAt">Ultima Actualizacion</Label>
              <p>{moment(cashRegister.updatedAt).format('llll')}</p>
              <div>
                <Label>Por</Label>
                <p>{cashRegister.updatedBy.usuario}</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <Label className="text-xl" htmlFor="transacciones">
            Transacciones
          </Label>
          <Table
            columns={transactionColumns}
            actions={transactionActions}
            data={cashRegister.transacciones}
            defaultPageSize={5}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4">
          <Button size="sm" onClick={back} startIcon={<BiArrowBack />}>
            Volver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editRegister(cashRegister.codigo)}
            startIcon={<BiEdit />}
          >
            Editar
          </Button>
          {cashRegister.assignedTo === undefined && (
            <Button size="sm" onClick={() => handleAssignToUser()} startIcon={<UserIcon />}>
              Asignar
            </Button>
          )}
          {cashRegister.estado === 'abierta' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => closeRegister(cashRegister._id)}
              startIcon={<BiCollapse size={20} />}
            >
              Cerrar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openRegister(cashRegister._id)}
              startIcon={<BiFolderOpen />}
            >
              Abrir
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelRegister(cashRegister._id)}
            startIcon={<BiTrash size={20} />}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </>
  );
};
