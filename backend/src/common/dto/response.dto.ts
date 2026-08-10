import { PaginationMeta } from './pagination.dto';

export interface SingleResponseEnvelope<T> {
  data: T;
}

export interface CollectionResponseEnvelope<T> {
  data: T[];
}

export interface PaginatedResponseEnvelope<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ErrorBody {
  code: string;
  message: string;
  details?: ErrorDetail[] | any[];
}

export interface ErrorResponseEnvelope {
  error: ErrorBody;
}
