

interface PaginationListResult {
  items: any[]
  totalCount?: number
  hasNext?: boolean
  nextCursor?: string | null
}

// returns [items[], totalCount]
type PaginationListHandler = (
  pageSize: number,
  offset?: number,
  nextCursor?: string | null
) => Promise<PaginationListResult | undefined>
type PaginationRenderHandler = (pages: any[], hasNext: boolean, hasPrev: boolean, totalCount?: number) => Promise<void>

export class Pagination {
  private offset = 0
  private nextCursor: string | null | undefined
  private readonly pageSize: number
  private readonly loadList: PaginationListHandler
  private readonly renderList: PaginationRenderHandler


  constructor(pageSize: number, loadList: PaginationListHandler, renderList: PaginationRenderHandler) {
    this.pageSize = pageSize
    this.loadList = loadList
    this.renderList = renderList
  }


  async init() {
    await this.loadAndRenderPage()
  }

  async goNext() {
    this.offset += this.pageSize

    await this.loadAndRenderPage()
  }

  async goPrev() {
    this.offset -= this.pageSize

    await this.loadAndRenderPage()
  }


  private async loadAndRenderPage() {
    const result = await this.loadList(this.pageSize, this.offset, this.nextCursor)
    // do nothing in error case
    if (!result) return

    let hasNext: boolean
    let hasPrev: boolean

    if (typeof result.nextCursor === 'undefined') {
      // ordinary style
      hasNext = (typeof result.totalCount === 'number')
        ? (this.offset + this.pageSize < result.totalCount)
        : result.items.length === this.pageSize
      hasPrev = this.offset > 0
    }
    else {
      // notion style
      this.nextCursor = result.nextCursor

      hasNext = result.hasNext!
      hasPrev = this.nextCursor !== null
    }

    await this.renderList(result.items, hasNext, hasPrev, result.totalCount)
  }

}
