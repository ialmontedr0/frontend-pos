import Swal, { type SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const myAlert = withReactContent(Swal);

// Convertir el rol de usuario
export const parseUserRole = (rol: string) => {
  switch (rol) {
    case 'admin':
      return 'Administrador';
    case 'cajero':
      return 'Cajero';
    case 'inventarista':
      return 'Inventarista';
  }
};

export const parseCustomerType = (tipo: string): string => {
  switch (tipo) {
    case 'express':
      return 'Express';
    case 'comun':
      return 'Comun';
    default:
      return 'Desconocido';
  }
};

export const parseUserStatus = (estado: string) => {
  switch (estado) {
    case 'activo':
      return 'Activo';
    case 'inactivo':
      return 'Inactivo';
    default:
      'Desconocido';
  }
};

export const parsePaymentMethod = (metodoPago: string): string => {
  switch (metodoPago) {
    case 'efectivo':
      return 'Efectivo';
    case 'credito':
      return 'Credito';
    case 'tarjetaCreditoDebito':
      return 'Tarjeta';
    case 'puntos':
      return 'Puntos';
    default:
      return 'Desconocido';
  }
};

export const parseSaleStatus = (estado: string): string => {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'completada':
      return 'Completada';
    default:
      return 'Desconocido';
  }
};

export const parseTransactionType = (tipo: string): string => {
  switch (tipo) {
    case 'entrada':
      return 'Entrada';
    case 'salida':
      return 'Salida';
    default:
      return 'Desconocido';
  }
};

export const parseTextSizeName = (tamanoTexto: string): string => {
  switch (tamanoTexto) {
    case 'sm':
      return 'Pequeno';
    case 'md':
      return 'Mediano';
    case 'lg':
      return 'Grande';
    default:
      return 'Desconocido';
  }
};

// MyAlert success
export const myAlertSuccess = async (
  title: string,
  text: string
): Promise<SweetAlertResult<void>> => {
  return myAlert.fire({
    title: title,
    text: text,
    icon: 'success',
    timer: 5000,
    timerProgressBar: true,
  });
};

// myAlert error
export const myAlertError = async (
  title: string,
  text: string
): Promise<SweetAlertResult<void>> => {
  return myAlert.fire({
    title: title,
    text: text,
    icon: 'error',
    timer: 5000,
    timerProgressBar: true,
  });
};
