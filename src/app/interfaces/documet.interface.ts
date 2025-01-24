import { Area } from './area.interface';
import { DocumentType } from './documet-type.interface';
import { User } from './user.interface';

export interface DocumentListResponse {
  code?: number;
  success?: boolean;
  message?: string;
  data?: Document[];
}

export interface Document {
  Id?: string;
  VerificationCode?: string;
  AreaId?: number;
  TypeId?: number;
  YearPublication?: number;
  Name?: string;
  Description?: string;
  FilePath?: string;
  CreatedAt?: string;
  UpdatedAt?: string | null;
  IsActive?: boolean;
  UserId?: number;
  Area?: Area;
  Type?: DocumentType;
  User?: User;
}

// Interfaz para los errores (útil para respuestas de error)
export interface ErrorDetail {
  code?: string;
  field?: string;
  message?: string;
}

// Interfaz extendida para incluir errores en respuestas no exitosas
export interface DocumentTypeListResponseWithErrors
  extends Omit<DocumentListResponse, 'data'> {
  data?: Document[];
  errors?: ErrorDetail[];
}
