import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getUsersByRole } from '../../users/slices/usersSlice';

import Button from '../../../components/UI/Button/Button';
import { Label } from '../../../components/UI/Label/Label';
import Input from '../../../components/UI/Input/Input';
import { Modal } from '../../../components/UI/Modal/Modal';
import type { CashRegister } from '../interfaces/CashRegisterInterface';
import { BiSolidSave, BiSolidTrash, BiSolidUser, BiSolidXCircle } from 'react-icons/bi';
import {
  assignCashRegisterToUser,
  clearCashRegisterError,
  getCashRegisterByCode,
} from '../slices/cashRegisterSlice';
import { myAlertError, myAlertSuccess, parseUserRole } from '../../../utils/commonFunctions';
import type { User } from '../../users/interfaces/UserInterface';
import type { AssignRegisterToUserDTO } from '../dtos/assign-register-to-user.dto';

interface AssignToUserProps {
  cashRegister: CashRegister;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const AssignToUser: React.FC<AssignToUserProps> = ({
  cashRegister,
  isOpen,
  closeModal,
  error,
}) => {
  const dispatch = useAppDispatch();
  const myAlert = withReactContent(Swal);

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users } = useAppSelector((state: RootState) => state.users);

  const filteredUsers = users.filter((u) =>
    u.usuario.toLowerCase().includes(userQuery.toLowerCase())
  );

  const sanitizedRegisterForForm = (cashRegister: CashRegister): AssignRegisterToUserDTO => {
    const { assignedTo } = cashRegister;
    return {
      assignedTo,
    };
  };

  const { reset, handleSubmit } = useForm<AssignRegisterToUserDTO>({
    defaultValues: {
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (cashRegister) {
      dispatch(getUsersByRole('cajero'));
      reset(sanitizedRegisterForForm(cashRegister));
    }
  }, [cashRegister, dispatch]);

  const onSubmit = () => {
    myAlert
      .fire({
        title: `Asignar usuario`,
        text: `Estas seguro que deseas asignarle este usuario a esta caja?`,
        iconHtml: <BiSolidUser />,
        customClass: {
          icon: 'no-default-icon-border',
        },
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Asignar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed && selectedUser) {
          dispatch(
            assignCashRegisterToUser({
              registerId: cashRegister._id,
              assignRegisterToUserDTO: { assignedTo: selectedUser._id },
            })
          )
            .unwrap()
            .then(() => {
              closeModal();
              myAlertSuccess(`Usuario asignado`, `Se ha asignado el usuario con exito`);
              dispatch(getCashRegisterByCode(cashRegister!.codigo));
            })
            .catch((error: any) => {
              myAlertError(error);
            });
        }
      });
  };

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar',
        text: `Estas seguro que deseas cancelar esta accion?`,
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Continuar',
      })
      .then(() => {
        closeModal();
      });
  };

  if (!cashRegister) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Caja
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos la caja
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-fit overflow-y-auto px-2">
              <div className="">
                <h5 className="text-lg font-medium text-black dark:text-gray-200">
                  Asignar a Usuario
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="assignedTo">Usuario</Label>
                    <Input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder={selectedUser ? selectedUser.usuario : 'Buscar usuario'}
                    />
                    {userQuery && (
                      <ul className="overflow-auto max-h-40 border rounded mt-1 bg-white">
                        {filteredUsers.map((u) => (
                          <li
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                            key={u._id}
                            onClick={() => {
                              setSelectedUser(u);
                              setUserQuery('');
                            }}
                          >
                            {u.usuario}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedUser && (
                      <div className="flex flex-row gap-2 my-2">
                        <p className="mt-2 font-medium">
                          📌 {selectedUser.usuario} - {parseUserRole(selectedUser.rol)}{' '}
                        </p>
                        <Button
                          className="bg-transparent hover:bg-gray-100 p-1"
                          onClick={() => {
                            dispatch(clearCashRegisterError());
                            setSelectedUser(null);
                          }}
                          startIcon={<BiSolidTrash className="text-red-400" size={20} />}
                        ></Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex flex-wrap items-center gap-3 px-2 mt-4 justify-center md:justify-end">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                startIcon={<BiSolidSave size={20} />}
              >
                Guardar Cambios
              </Button>

              <Button
                size="sm"
                variant="outline"
                startIcon={<BiSolidXCircle size={20} />}
                onClick={cancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
