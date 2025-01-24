import { User } from './user.interface';

// Interfaz para los datos de login
export interface LoginData {
  Token: string;
  User: User;
}

// Interfaz principal para la respuesta de login
export interface LoginResponse {
  code: number;
  success: boolean;
  message: string;
  data: LoginData;
}

// Interfaz para los errores (útil para respuestas de error)
export interface ErrorDetail {
  code: string;
  field?: string;
  message: string;
}

// Interfaz extendida para incluir errores en respuestas no exitosas
export interface LoginResponseWithErrors extends Omit<LoginResponse, 'data'> {
  data?: LoginData;
  errors?: ErrorDetail[];
}
