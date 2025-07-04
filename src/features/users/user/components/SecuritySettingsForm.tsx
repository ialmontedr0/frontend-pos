import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../../../hooks/hooks';
import { changePassword } from '../slices/profileSlice';
import { clearAuth } from '../../../auth/slices/authSlice';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../components/UI/NewCard/Card';
import Button from '../../../../components/UI/Button/Button';
import Input from '../../../../components/UI/Input/Input';
import { Label } from '../../../../components/UI/Label/Label';
import { toast } from '../../../../components/UI/Toast/hooks/useToast';
import { AiFillEye, AiFillEyeInvisible, AiOutlineKey } from 'react-icons/ai';

type SecurityForm = {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
};

export const SecuritySettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<SecurityForm>({
    defaultValues: {
      contrasenaActual: '',
      nuevaContrasena: '',
      confirmarContrasena: '',
    },
  });

  const onSubmit = (data: SecurityForm) => {
    if (data.nuevaContrasena !== data.confirmarContrasena) {
      console.log(`${data.nuevaContrasena} - ${data.confirmarContrasena}`)
      toast({
        title: 'Error',
        description: 'Las contrasenas nuevas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    const { nuevaContrasena } = data;
    const lengthOK = nuevaContrasena.length >= 8;
    const upperCaseOK = /[A-Z]/.test(nuevaContrasena);
    const digitOK = /\d/.test(nuevaContrasena);
    const symbolOK = /\W|_/.test(nuevaContrasena);
    if (!lengthOK || !upperCaseOK || !digitOK || !symbolOK) {
      toast({
        title: 'Error',
        description: `La contrasena debe cumplir los requisitos minimos.`,
      });
      return;
    }

    if (data.nuevaContrasena.length < 8) {
      toast({
        title: 'Error',
        description: 'La contrasena debe tener al menos 8 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      changeUserPasswordDTO: {
        contrasenaActual: data.contrasenaActual,
        nuevaContrasena: data.nuevaContrasena,
        confirmarContrasena: data.confirmarContrasena,
      },
    };

    dispatch(changePassword(payload))
      .unwrap()
      .then(() => {
        toast({
          title: 'Contrasena actualizada',
          description: 'Tu contrasena ha sido actualizada correctamente.',
          timeout: 2,
          onTimeout: () => {
            dispatch(clearAuth());
            navigate('/auth/login');
          },
        });
      })
      .catch((error: any) => {
        toast({
          title: `Error`,
          description: `Error: ${error.response?.data?.message || error.message}`,
          variant: 'destructive',
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AiOutlineKey className="h-5 w-5" />
          Cambiar Contrasena
        </CardTitle>
        <CardDescription>Actualiza tu contrasena para manener tu cuenta segura.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contrasenaActual">Contrasena Actual</Label>
            <div className="relative">
              <Input
                id="contrasenaActual"
                {...register('contrasenaActual', { required: 'El campo contrasena es obligatorio' })}
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contrasena actual"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <AiFillEyeInvisible className="h-4 w-4" />
                ) : (
                  <AiFillEye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showCurrentPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nuevaContrasena">Nueva Contrasena</Label>
            <div className="relative">
              <Input
                id="nuevaContrasena"
                {...register('nuevaContrasena', { required: 'El campo es obligatorio' })}
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Ingresa tu nueva contrasena"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <AiFillEyeInvisible className="h-4 w-4" />
                ) : (
                  <AiFillEye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showNewPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                </span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              La contrasena debe tener al menos 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarContrasena">Confirmar Nueva Contrasena</Label>
            <div className="relative">
              <Input
                id="confirmarContrasena"
                {...register('confirmarContrasena', { required: 'El campo es obligatorio' })}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirma tu nueva contrasena"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible className="h-4 w-4" />
                ) : (
                  <AiFillEye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            Actualizar contrasena
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
