export interface ListResponse<Item> {
  result: Item[]
  pageNum: number
  perPage: number
  totalPages: number
}
