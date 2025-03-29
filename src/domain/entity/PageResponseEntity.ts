export class PagedResponseEntity<T> {
  items: T[] = [];
  currentPage: number = 0;
  pageSize: number = 0;
  totalPages: number = 0;
  totalCount: number = 0;

  constructor(
    items: T[] = [],
    currentPage: number = 0,
    pageSize: number = 0,
    totalPages: number = 0,
    totalCount: number = 0
  ) {
    this.items = items;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.totalCount = totalCount;
  }

  //   from json
  static fromJson(json: any): PagedResponseEntity<any> {
    return new PagedResponseEntity(
      json.items,
      json.currentPage,
      json.pageSize,
      json.totalPages,
      json.totalCount
    );
  }
}
