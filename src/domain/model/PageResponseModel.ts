
export interface IPagedResponse<T> {
    items: T[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  }
