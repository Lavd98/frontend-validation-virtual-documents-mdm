import { Area } from './area.interface';

export interface UserBody
  extends Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {
  Password?: string;
}

// Interfaz para el usuario
export interface User {
  Id?: string;
  Name?: string;
  LastName?: string;
  Profile?: string;
  Username?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  IsActive?: boolean;
  Password?: string;
  AreaId?: string;
  Area?: Area;
}

// Interfaz principal para la respuesta de la lista de usuarios
export interface UserListResponse {
  code?: number;
  success?: boolean;
  message?: string;
  data?: User[];
}

// Interfaz para los errores (útil para respuestas de error)
export interface ErrorDetail {
  code?: string;
  field?: string;
  message?: string;
}

// Interfaz extendida para incluir errores en respuestas no exitosas
export interface UserListResponseWithErrors
  extends Omit<UserListResponse, 'data'> {
  data?: User[];
  errors?: ErrorDetail[];
}
