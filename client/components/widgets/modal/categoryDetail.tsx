// import { useState } from "react"
// import Dropdown from 'react-dropdown'

import { StyledContainedBar } from "@/src/styles/main.styled"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnParagraph, cnSectionSmallTitle, cnSectionTitle } from "@/src/styles/classnames.tailwind"
import { IconTitleComponent } from "../iconed"
import { faClone } from "@fortawesome/free-solid-svg-icons"
// import { useCategorysWIthItemsCount } from "@/src/hooks/useCategory"
// import { ItemCategorys } from "../itemCategorys"
import { CategoryApiData } from "@/src/models/category"
// import Link from "next/link"
// import { useUncategoryAuthor, useCategoryAuthor } from "@/src/hooks/useAuthors"

export const CategoryDetailModalComponent = ({
        category, 
        // userId,
        onClose 
    }: { 
        category: CategoryApiData; 
        onClose: () => void; 
        // userId: number;
    }) => {
    
    // const { data: categorysData } = useCategorysWIthItemsCount()

    // const [wid, setWid] = useState<string | undefined>(undefined)
    
    // const categoryAuthorMuotation = useCategoryAuthor()
    // const uncategoryAuthorMutation = useUncategoryAuthor()

    // const disabledCategory = (categoryID: number) => category.categorys?.some(w => w.category_id === Number(categoryID))

    // const categoryOpts = categorysData?.categorys ? categorysData.categorys.map(w => {
    //     return { label: w.category_name, value: `${ w.category_id }`, className: disabledCategory(w.category_id) ? 'disabled' : '' }
    // }) : []

    // const onSetCategory = () => {

    //     categoryAuthorMuotation.mutate({
    //         category_id: Number(category.category_id),
    //         user_id: Number(userId),
    //         category_id: wid ? Number(wid) : 0,
    //     })
    // }

    // const onDeleteCategory = (categoryId: number) => {
        
    //     uncategoryAuthorMutation.mutate({
    //         category_id: Number(category.category_id),
    //         user_id: Number(userId),
    //         category_id: categoryId,
    //     })
    // }

    return <div className="overlay-full p-4 bg-white" style={{ overflowY: 'scroll' }}>
        <div className="overlay-full-content rounded-lg shadow article-detail">
            <StyledContainedBar>
                <CloseIconButtonComponent onClose={ onClose } />
            </StyledContainedBar>
            <IconTitleComponent
                text={ category.category_name }
                icon={ faClone }
            />
            <div style={{ height: '100%' }}>
                <div  style={{ overflowY: 'scroll', height: 'calc(100% - 200px)' }}>
                {
                    category.articles ? 
                        <div>
                            <h3 className={ cnSectionTitle }>Articles</h3>
                            {
                                category.articles.map(a => {
                                    return <div  key={ a.article_id }>
                                    
                                    <h2 className={ cnSectionSmallTitle }><a href={ a.article_link} target="_blank">{ a.article_title }</a></h2>
                                    <p className={ cnParagraph }>{ a.article_description }</p>
                                    </div>
                                })
                            }
                        </div> : null
                }
                
                </div>
            </div>
        </div>
    </div>
}
