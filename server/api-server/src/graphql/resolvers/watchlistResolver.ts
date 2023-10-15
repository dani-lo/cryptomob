import { ArticlesTags, Tag } from '@prisma/client';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        async watchlists() {

            return await dataSources.watchlistService.getWatchlists()

        }
    },

    Mutation: {
        
        async createWatchlist(_: any, args: { input : { watchlist_name: string; user_id: number} }) { 

            const {
                watchlist_name,
                user_id
            } = args.input
 
            const watchlist = await dataSources.watchlistService.createWatchlist(watchlist_name, user_id)

            return watchlist
        },

        async watchlistArticle(_: any, args: { watchlist_id: number, article_id: number }) {

            const {
                watchlist_id,
                article_id
            } = args
 
            const watchlistArticle = await dataSources.watchlistService.watchlistArticle(watchlist_id, article_id)

            return watchlist_id
            
        }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Watchlist: {

        articles (parent: { watchlist_id: number }) {
            return dataSources.watchlistService.getWatchlistArticles(parent.watchlist_id);
        },
        authors(parent: { watchlist_id: number }) {
           return dataSources.watchlistService.getWatchlistAuthors(parent.watchlist_id);
        },
        tags(parent: { watchlist_id: number }) {
            return dataSources.watchlistService.getWatchlistTags(parent.watchlist_id);
        },
        coins(parent: { watchlist_id: number }) {
            return dataSources.watchlistService.getWatchlistCoins(parent.watchlist_id);
        },
        user(parent: { user_id: number }) {
            return dataSources.userService.getUser(parent.user_id);
        }
    }
}