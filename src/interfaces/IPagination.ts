export interface Pagination<T> {
  docs:        T[];
  totalDocs:   number;
  limit:       string;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page:        string;
  totalPages:  number;
}