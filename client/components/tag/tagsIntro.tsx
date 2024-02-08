
import { cnBold, cnParagraph, cnSectionTitle } from '@/src/styles/classnames.tailwind'

export const TagsIntroComponent = () => {

    return <div className="sect-intro">
        <h2 className={ cnSectionTitle}>Tags</h2>
        <p className={ cnParagraph}>All tags extracted from all articles that can be viewed on this particular <span className={ cnBold }>Q-rated app</span></p>
        <p className={ cnParagraph}><span className={ cnBold }>Please note</span>: in order for you to be able to add tags, you will need to be logged in</p>
    </div>
}