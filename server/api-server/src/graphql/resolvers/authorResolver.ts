// import { Article } from '@prisma/client';
import { DatedWhereParams, PaginationQueryParams } from '.';
import { dataSources } from '../datasources';
import { hasNamedProp } from '../../helpers/obj';

export default {
    Query: {
        
        async authors(_parent: any, args: { params: DatedWhereParams }) {
            
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

            const authors = await dataSources.authorService.pgGetAuthors(
                args.params.fromDate,
                args.params.toDate,
                filters,
                filters.appId === 100
            )

            return authors?.rows?.map(r => ({ ...r, articles_count: 12})) || []
        },

        async paginatedAuthors(_parent: any, args: { params: PaginationQueryParams }) {
            
            const filters = {
                appId: args.params.appId,
            }

            const result = await dataSources.authorService.pgGetPaginatedAuthors(
                args.params.fromDate,
                args.params.toDate,
                args.params.offset,
                args.params.limit,
                filters
            )
            
            return {
                authors: result.authors,
                recordsCount: result.authorsCount
            }
        },
    },

    Mutation : {

        async createAuthor(_: any, args: { input : { author_name: string} }) {

            const newAuthor = await dataSources.authorService.pgcCreateAuthor(args.input.author_name)

            return  newAuthor?.rows ? newAuthor.rows[0] : []
        },

        async setWatchlistAuthor (_: any, args: { input: { author_id: number, watchlist_id: number } }) {

            const {
                author_id,
                watchlist_id
            } = args.input
            
            await dataSources.watchlistService.pgWatchlistAuthor(watchlist_id, author_id)
            
            const result = await dataSources.authorService.pgGetAuthor(author_id)
            
            return  result?.rows ? result.rows[0] : []
        },

        async deleteWatchlistAuthor(_: any, args: { input: { author_id: number, watchlist_id: number } } ) {
            
            const {
                author_id,
                watchlist_id
            } = args.input
            
            await dataSources.authorService.pgDeleteAuthorWatchlist(author_id, watchlist_id)
            
            const result = await dataSources.authorService.pgGetAuthor(author_id)


            return  result?.rows ? result.rows[0] : []
        }
    },

    Author: {

        async articles(parent: { author_id:  number }) {

            const result = await dataSources.articleService.pgGetAuthorArticles(parent.author_id)

            return result.rows
        },
        
        async watchlists(parent: { author_id:  number }) {

            const result = await dataSources.authorService.pgGetAuthorWatchlists(parent.author_id);

            return result.rows 
        }
    }
};
