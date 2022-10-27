export interface PaginateResult<T> {
  result: T[];
  total: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
