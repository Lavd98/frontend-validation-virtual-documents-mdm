export interface AreaListResponse {
  code?: number;
  success?: boolean;
  message?: string;
  data?: Area[];
}

export interface Area {
  Id?: string;
  Name?: string;
  Abbreviation?: string;
  IsActive?: boolean;
}

// Interfaz para los errores (útil para respuestas de error)
export interface ErrorDetail {
  code?: string;
  field?: string;
  message?: string;
}

// Interfaz extendida para incluir errores en respuestas no exitosas
export interface AreaListResponseWithErrors
  extends Omit<AreaListResponse, 'data'> {
  data?: Area[];
  errors?: ErrorDetail[];
}
