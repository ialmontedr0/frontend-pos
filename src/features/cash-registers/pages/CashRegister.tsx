import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
import moment from 'moment';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Table } from '../../../components/Table/Table';
import {
  BiArrowBack,
  BiEdit,
  BiFolderOpen,
  BiTrash,
  BiUserPin,
  BiWindowClose,
} from 'react-icons/bi';
import Button from '../../../components/UI/Button/Button';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import type { User } from '../../users/interfaces/UserInterface';

export const CashRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
                myAlert.fire({
                  title: 'Caja abierta',
                  text: `Se ha abierto la caja con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
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
        if (result.isConfirmed && result.value && codigo) {
          const user = result.value as User;
          dispatch(
            assignCashRegisterToUser({
              userId: user._id,
              codigo: codigo,
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
    <div className="h-full p-4 max-w-full">
      <div>
        <h2 className="text-2xl font-semibold">Detalles de la caja</h2>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <Label htmlFor="codigo">Caja</Label>
          <p>{cashRegister.codigo}</p>
        </div>

        <div>
          <Label htmlFor="estado">Estado</Label>
          <p
            className={`
            rounded-full w-fit text-xs text-gray-700 px-2 py-0.5 ${
              cashRegister.estado === 'abierta' ? 'bg-green-400' : 'bg-red-400 text-white'
            }`}
          >
            {cashRegister.estado.charAt(0).toUpperCase() + cashRegister.estado.slice(1)}
          </p>
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

        {cashRegister.openBy && (
          <div>
            <Label htmlFor="openBy">Abierta por</Label>
            <p>{cashRegister.openBy.usuario}</p>
          </div>
        )}

        {cashRegister.closedBy && (
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

        <div>
          <Label htmlFor="updatedAt">Ultima Actualizacion</Label>
          <p>{moment(cashRegister.updatedAt).format('LLLL')}</p>
          {cashRegister.updatedBy && (
            <div>
              <Label>Por</Label>
              <p>{cashRegister.updatedBy.usuario}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="transacciones">Transacciones</Label>
        <Table
          columns={transactionColumns}
          actions={transactionActions}
          data={cashRegister.transacciones}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={back} className="rounded-full px-3 py-1 bg-blue-900 text-white text-sm">
          <BiArrowBack size={28} />
        </button>
        {cashRegister.assignedTo === undefined && (
          <button onClick={() => handleAssignToUser()} className="relative flex flex-row">
            <span>Asignar</span> <BiUserPin size={28} />
          </button>
        )}
        <button onClick={() => editRegister(cashRegister.codigo)}>
          <BiEdit size={28} />
        </button>
        {cashRegister.estado === 'abierta' ? (
          <button onClick={() => closeRegister(cashRegister._id)}>
            <BiFolderOpen size={28} />
          </button>
        ) : (
          <button onClick={() => openRegister(cashRegister._id)}>
            <BiWindowClose size={28} />
          </button>
        )}
        <button onClick={() => onDelRegister(cashRegister._id)}>
          <BiTrash size={28} />
        </button>
      </div>
    </div>
  );
};
