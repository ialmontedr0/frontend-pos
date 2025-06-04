export interface LoginDTO {
  usuario: string;
  contrasena: string;
}

export interface LoginResponseDTO {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    usuario: string;
    rol: string;
  };
}

export interface RecoverPasswordDTO {
  usuario: string;
}

export interface ValidateCodeDTO {
  usuario: string;
  codigo: string;
}

export interface ChangePasswordDTO {
  usuario: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}
