// import { ArticlesTags, Tag } from '@prisma/client';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        async watchlists() {

            const result = await dataSources.watchlistService.pgGetWatchlists()

            return result?.rows || []

        }
    },

    Mutation: {
        
        async createWatchlist(_: any, args: { input : { watchlist_name: string; user_id: number} }) { 

            const {
                watchlist_name,
                user_id
            } = args.input
 
            const watchlist = await dataSources.watchlistService.pgCreateWatchlist(watchlist_name, user_id)

            return watchlist.rows
        }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Watchlist: {

        async articles (parent: { watchlist_id: number }) {

            const result = await dataSources.watchlistService.pgGetWatchlistArticles(parent.watchlist_id)

            return result.rows
        },
        async authors(parent: { watchlist_id: number }) {
            
            console.log('---- WL AUTHORS', parent.watchlist_id)
            
            const result = await dataSources.watchlistService.pgGetWatchlistAuthors(parent.watchlist_id)

            return result.rows
        },
        async tags(parent: { watchlist_id: number }) {

            const result = await dataSources.watchlistService.pgGetWatchlistTags(parent.watchlist_id);

            return result.rows
        },
        async coins(parent: { watchlist_id: number }) {

            const result = await dataSources.watchlistService.pgGetWatchlistCoins(parent.watchlist_id)

            return result.rows
        },
        async user(parent: { user_id: number }) {

            const result = await dataSources.userService.pgGetUser(parent.user_id)

            return result.rows[0]
        }
    }
}