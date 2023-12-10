import { range } from '@/src/helpers/range'

export class PaginationCtrl {
    
    public currPage: number
    public totalPages: number
    public itemsPerPage: number
    public offset: number
    public maxPagesInWidget = 7

    public constructor (
            numItems: number, 
            offset: number, 
            itemsPerPage: number) {
        
        this.currPage = offset > 0 ? Math.ceil(offset / itemsPerPage) : 0
        this.itemsPerPage = itemsPerPage
        this.totalPages = Math.ceil(numItems / itemsPerPage)
        this.offset = offset

        console.log('NEW PAGGGG numitems', numItems)
    }

    public getCurrPage () : number {

        return this.currPage
    }

    public setCurrPage (page: number) {

        this.currPage = page
    }

    public nextOffset () {

        return this.currPage * this.itemsPerPage
    }

    public pageNumbers (): number[] {

        if (this.totalPages <= this.maxPagesInWidget) {
            
            return range(this.totalPages, 0) 

        } else if (this.currPage < Math.ceil(this.maxPagesInWidget / 2)) {
            
            return range(this.maxPagesInWidget, 0) 

        } else if (this.currPage < (this.totalPages - this.maxPagesInWidget)) {

            const startPage = this.currPage - Math.floor(this.maxPagesInWidget / 2)

            return range(this.maxPagesInWidget, startPage) 
        } else  {
            
            const startPage = this.totalPages - this.maxPagesInWidget 

            return range(this.maxPagesInWidget, startPage) 
        }
    }

    public next () {

        const nextPage = this.maybeNext()

        if (nextPage !== null) {
            this.currPage = nextPage
        }
        
    }

    public prev () {
        
        const prevPage = this.maybePrev()

        if (prevPage !== null) {
            this.currPage = prevPage
        }
        
    }

    public pageItemInRange (pageItemIndex: number) : boolean {

        const range = [
            this.offset,
            this.offset + this.itemsPerPage

        ]
      
        return pageItemIndex >= range[0] && pageItemIndex < range[1]
    }

    public maybeNext () : number | null {

        const maybeNextPage = this.currPage + 1
        
        if (maybeNextPage >= this.totalPages) {
            return null
        }
        
        return maybeNextPage
    }

    public maybePrev () : number | null {

        const maybePrevPage = this.currPage - 1
        
        if (maybePrevPage < 0) {
            return null
        }
        
        return maybePrevPage
    }
}