import { ArticlesTags, Tag } from '@prisma/client';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
import { PaginationQueryParams } from '.';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {

        async categories(_parent: any, args: { params: PaginationQueryParams }) {

            const result : any = await dataSources.categoryService.getCategories(
                args.params.whereTags || null, 
                args.params.whereAuthors || null
            )

            return result.map((r: any) => {
                return {
                    ...r,
                    articles_count: Number(r.articles_count)
                }
            })
        }
    },

    Mutation: {
        
        async createCategory(_: any, args: { input : { 
            category_id?: number
            category_name: string
            user_id: number 
        } }) {
             
            const {
                category_id,
                category_name,
                user_id
            } = args.input
 
            const category = await dataSources.categoryService.createCategory(category_name, user_id)

            return category
        },

        async categoriseArticle(_: any, args: { category_id: number, article_id: number }) {

            const {
                category_id,
                article_id
            } = args
 
            const article = await dataSources.articleService.categoriseArticle(category_id, article_id)

            return category_id
        }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Category: {
        
        // authors(parent: { watchlist_id: number }) {
        //    return dataSources.watchlistService.get(parent.watchlist_id);
        // },
        // tags(parent: { watchlist_id: number }) {
        //     return dataSources.watchlistService.getWatchlistTags(parent.watchlist_id);
        // },
        articles(parent: {category_id: number }) {
               return dataSources.categoryService.getCategoryArticles(parent.category_id)
            },
        user(parent: { user_id: number }) {
            return dataSources.userService.getUser(parent.user_id);
        }
    }
}