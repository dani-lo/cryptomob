
import { cnBold, cnParagraph, cnSectionTitle } from '@/src/styles/classnames.tailwind'

export const CategoriesIntroComponent = () => {

    return <div className="sect-intro">
        <h2 className={ cnSectionTitle}>Categories</h2>
        <p className={ cnParagraph}>All categories available on this particular <span className={ cnBold }>Q-rated app</span>, added by users</p>
        <p className={ cnParagraph}><span className={ cnBold }>Please note</span>: in order for you to be able to add categories, or assign articles to a category, you will need to be logged in</p>
    </div>
}