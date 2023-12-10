import { PaginationCtrl } from "@/src/utils/paginationCtrl"
import { StyledPaginationContainer } from "@/src/styles/main.styled"
import { getAppStaticSettings } from "@/src/store/static"
import { utils } from "@/src/styles/classnames.tailwind"

export const PaginationComponent = ({
    paginationCtrl,
    onSelectPage,
}: { 
    paginationCtrl: PaginationCtrl, 
    onSelectPage: (nextOffset: number) => void,
}) => {

    const currPage = paginationCtrl.getCurrPage()
    const pages = paginationCtrl.pageNumbers()

    const appStaticSettings = getAppStaticSettings()

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

    return <StyledPaginationContainer>
        <ul className={ utils.cnJoin(['inline-flex text-sm', appStaticSettings.bg, 'p-3']) } style={{ background: 'white', border: '1px solid #aaa',  borderRadius: '0.2rem'}}>
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
                    }} key={ page } className={ page === currPage ? appStaticSettings.bgEvidence + ' pagination-item page-link page-link-active' : 'bg-white pagination-item page-link' }>
                    <span>
                        { page + 1 }
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