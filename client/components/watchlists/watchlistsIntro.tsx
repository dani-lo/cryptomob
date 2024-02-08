
import { cnBold, cnParagraph, cnSectionTitle } from '@/src/styles/classnames.tailwind'

export const WatchlistsIntroComponent = () => {

    return <div className="sect-intro">
        <h2 className={ cnSectionTitle}>Watchlists</h2>
        <p className={ cnParagraph}>All Watchlists available on this particular <span className={ cnBold }>Q-rated app</span>, added by users and used to keep track of specific authors, tags etc (and cosequently their related articles ..)</p>
        <p className={ cnParagraph}><span className={ cnBold }>Please note</span>: in order for you to be able to add watchlists, or assign items (tags, authors ..) to a watchlist, you will need to be logged in</p>
    </div>
}