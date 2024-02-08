
import { cnBold, cnParagraph, cnSectionTitle } from '@/src/styles/classnames.tailwind'

export const AuthorsIntroComponent = () => {

    return <div className="sect-intro">
        <h2 className={ cnSectionTitle}>Authors</h2>
        <p className={ cnParagraph}>All authors extracted from all articles that can be viewed on this particular <span className={ cnBold }>Q-rated app</span></p>
        <p className={ cnParagraph}><span className={ cnBold }>Please note</span>: in order for you to be able to add authors, you will need to be logged in</p>
    </div>
}