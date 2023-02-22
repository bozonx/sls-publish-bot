

// returns [items[], totalCount]
type PaginationListHandler = (offset: number, pageSize: number) => Promise<[any[], number?]>
type PaginationRenderHandler = (pages: any[], hasNext: boolean, hasPrev: boolean, totalCount?: number) => Promise<void>

export class Pagination {
  private offset = 0
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


  private async loadAndRenderPage() {
    const [pages, totalCount] = await this.loadList(this.offset, this.pageSize)
    const hasNext = pages.length === this.pageSize
    const hasPrev = this.offset > this.pageSize - 1

    // TODO: нужно ли отнимать -1 ?
    // TODO: проверить конец
    this.offset += this.pageSize

    await this.renderList(pages, hasNext, hasPrev, totalCount)
  }

}
