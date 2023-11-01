import { PaginationCtrl } from "@/src/utils/paginationCtrl"
import { StyledPaginationContainer } from "@/src/styles/main.styled"
export const PaginationComponent = ({
    paginationCtrl,
    onSelectPage,
}: { 
    paginationCtrl: PaginationCtrl, 
    onSelectPage: (nextOffset: number) => void,
}) => {

    const currPage = paginationCtrl.getCurrPage()
    const pages = paginationCtrl.pageNumbers()

    const onNavClickPrev = () => {

        paginationCtrl.prev()

        onSelectPage(paginationCtrl.nextOffset())
    }
    const onNavClickNext = () => {

        paginationCtrl.next()

        onSelectPage(paginationCtrl.nextOffset())
    }

    const onPageClick = (pageNum: number) => {

        paginationCtrl.setCurrPage(pageNum)

        onSelectPage(paginationCtrl.nextOffset())
    }

    // console.log('paginationCtrl.currPage, paginationCtrl.totalPages', paginationCtrl.currPage, paginationCtrl.totalPages)

    return <StyledPaginationContainer>
        <ul className="inline-flex -space-x-px text-sm">
            <li 
                    onClick={ (e) =>  {
                        e.preventDefault()
                        onNavClickPrev()
                    }} 
                    className={ paginationCtrl.maybePrev() !== null ?  'pagination-item nav-link' : 'pagination-item nav-link nav-link-disabled' }>
                <span>
                    &lt;&lt;
                </span>
            </li>
            {
                pages.map(page => {
                    return <li 
                    onClick={ (e) => {
                        e.preventDefault()
                        onPageClick(page)
                    }} key={ page } className={ page === currPage ? 'pagination-item page-link page-link-active  bg-cyan-95' : 'pagination-item page-link' }>
                    <span>
                        { page }
                    </span>
                </li>
                })
            }
            <li 
                    onClick={ (e) =>  {
                        e.preventDefault()
                        onNavClickNext()
                    }} className={ paginationCtrl.maybeNext() !== null ?  'pagination-item nav-link' : 'pagination-item nav-link nav-link-disabled' }>
                <span>
                    &gt;&gt;
                </span>
            </li>
        </ul>
    </StyledPaginationContainer>
}