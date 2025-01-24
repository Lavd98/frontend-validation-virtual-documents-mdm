export interface DocumentTypeListResponse {
  code?: number;
  success?: boolean;
  message?: string;
  data?: DocumentType[];
}

export interface DocumentType {
  Id?: string;
  Name?: string;
  IsActive?: boolean;
}

// Interfaz para los errores (útil para respuestas de error)
export interface ErrorDetail {
  code?: string;
  field?: string;
  message?: string;
}

// Interfaz extendida para incluir errores en respuestas no exitosas
export interface DocumentTypeListResponseWithErrors
  extends Omit<DocumentTypeListResponse, 'data'> {
  data?: DocumentType[];
  errors?: ErrorDetail[];
}
