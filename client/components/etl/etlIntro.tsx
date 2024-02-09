import { cnBold, cnParagraph, cnSectionTitle } from '@/src/styles/classnames.tailwind'

export const EtlIntroComponent = () => {
    return <div className="sect-intro">
        <h2 className={ cnSectionTitle}>Data Acquisition</h2>
        <p className={ cnParagraph}>Use this section to import data (articles, authors for this <span className={ cnBold }>Q-rated app</span></p>
        <p className={ cnParagraph}><span className={ cnBold }>Please note</span>: in order for you to be able to add articles, you will need to be logged in</p>
    </div>
}