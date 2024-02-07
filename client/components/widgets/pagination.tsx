import { PaginationCtrl } from "@/src/utils/paginationCtrl"
import { getAppStaticSettings } from "@/src/store/static"
import { utils, cnPaginationContainer } from "@/src/styles/classnames.tailwind"

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

    return <div className={ cnPaginationContainer }>
        <ul className={ utils.cnJoin(['inline-flex text-sm', appStaticSettings.bg, 'p-3', 'pagination shadow']) }>
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
                    }} key={ page } className={ 
                        page === currPage ? 
                            appStaticSettings.bgUnactive + ' pagination-item page-link page-link-active' : 
                            'pagination-item page-link' }>
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
    </div>
}