// import { ArticlesTags, Tag } from '@prisma/client';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
import { DatedWhereParams, PaginationQueryParams } from '.';
import { hasNamedProp } from '../../helpers/obj';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {

        async categories(_parent: any, args: { params: DatedWhereParams }) {
            const filters = {
                appId: args.params.appId,
                whereAuthors: args.params.whereAuthors || null,
                whereTags: args.params.whereTags?.length ? args.params.whereTags : null,
                whereCategories: args.params.whereCategories || null,
                whereHashtags: args.params.whereHashtags || null, 
                tagged : hasNamedProp(args.params, 'tagged') ? args.params.tagged  : null,
                userTagged :hasNamedProp(args.params, 'userTagged') ? args.params.userTagged  : null,
                commented :hasNamedProp(args.params, 'commented') ? args.params.commented  : null,
                watchlisted :hasNamedProp(args.params, 'watchlisted') ? args.params.watchlisted  : null,
                categoryized :hasNamedProp(args.params, 'categoryized') ? args.params.categoryized  : null,
                authored :hasNamedProp(args.params, 'authored') ? args.params.authored  : null,
                userAdded :hasNamedProp(args.params, 'userAdded') ? args.params.userAdded  : null,
                bookmarked :hasNamedProp(args.params, 'bookmarked') ? args.params.bookmarked  : null,
            }
            console.log(filters)


            // const result : any = await dataSources.categoryService.getCategories(
            //     args.params.fromDate,
            //     args.params.toDate,
            //     filters
            // )

            // return result.map((r: any) => {
            //     return {
            //         ...r,
            //         articles_count: Number(r.articles_count)
            //     }
            // })
            const result : any = await dataSources.categoryService.pgGetCategories(
                args.params.fromDate,
                args.params.toDate,
                filters
            )

            return result.rows.map((r: any) => {
                return {
                    ...r,
                    articles_count: Number(r.articles_count)
                }
            })
        },
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
 
            // const category = await  dataSources.categoryService.createCategory(category_name, user_id)
            const category = await  dataSources.categoryService.pgcCreateCategory(category_name, user_id)

            return category
        },
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
        async articles(parent: {category_id: number }) {
            const catArticles = await dataSources.categoryService.pgGetCategoryArticles(parent.category_id)
               
            return catArticles.rows
        },
        async user(parent: { user_id: number }) {
            
            const userRow = await dataSources.userService.pgGetUser(parent.user_id)

            return userRow.rows[0]
        }
    }
}