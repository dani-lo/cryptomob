// import { Tag } from '@prisma/client';

import { DatedWhereParams, PaginationQueryParams, QRATED_AUTH_ERROR } from '.'
import { dataSources } from '../datasources'
import { hasNamedProp } from '../../helpers/obj'
import { GraphQLError } from 'graphql'

export default {
    Query: {

        async paginatedTags(_parent: any, args: { params: PaginationQueryParams }) {
            
            const filters = {
                appId: args.params.appId,
            }

            const result = await dataSources.tagService.pgGetPaginatedTags(
                args.params.fromDate,
                args.params.toDate,
                args.params.offset,
                args.params.limit,
                filters
            )
            
            return {
                tags: result.tags,
                recordsCount: result.tagsCount
            }
        },

        async tags(_parent: any, args: { params: DatedWhereParams }) {
            
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

            const result = await dataSources.tagService.pgGetTags(
                args.params.fromDate,
                args.params.toDate,
                filters
            )
            
            return result.rows.map((r) => {

                return {
                    ...r,
                    articles_count: Number(r.articles_count)
                }
            })
        },

        async tag (_parent: any, args: { params: { itemId: number} }) {
            
            const {
                itemId: tagId 
            } = args.params

            const tagRows = await dataSources.tagService.pgGetTag(tagId)

            return  tagRows?.rows?.length ? tagRows.rows[0] : null
        }
    },

    Mutation: {
        async createTag(_: any, args: { input : { tag_name: string; tag_origin: string; } }, contextValue: any) {

            const user = contextValue.user 

            if (!user?.userId) {
                throw new GraphQLError(QRATED_AUTH_ERROR)
            }

            const newTag = await dataSources.tagService.pgcCreateTag(args.input.tag_name, args.input.tag_origin)

            return  newTag?.rows ? newTag.rows[0] : []
        },

       

        async setWatchlistTag(_: any, args: { input: { tag_id: number, watchlist_id: number } }, contextValue: any) {

            const user = contextValue.user 

            if (!user?.userId) {
                throw new GraphQLError(QRATED_AUTH_ERROR)
            }

            const {
                tag_id,
                watchlist_id
            } = args.input
            
            await dataSources.watchlistService.pgWatchlistTag(watchlist_id, tag_id)
            
            const result = await dataSources.tagService.pgGetTag(tag_id)

            return  result?.rows ? result.rows[0] : []
        },

        async deleteWatchlistTag(_: any, args: { input: { tag_id: number, watchlist_id: number } } , contextValue: any) {

            const user = contextValue.user 

            if (!user?.userId) {
                throw new GraphQLError(QRATED_AUTH_ERROR)
            }
            
            const {
                tag_id,
                watchlist_id
            } = args.input
            
            await dataSources.tagService.pgDeleteWatchlistTag(tag_id, watchlist_id)
            
            const result = await dataSources.tagService.pgGetTag(tag_id)
            
            return  result?.rows ? result.rows[0] : []
        }

    },
    Tag: {
        async articles(parent:  { tag_id : number}) {
            
            const result = await dataSources.articleService.pgGetTagArticles(parent.tag_id)
            
            return  result?.rows || []
        },

        async watchlists(parent:  { tag_id : number}) {
            
            const result = await dataSources.tagService.pgGetTagWatchlists(parent.tag_id)
            
            return  result?.rows || []
        }
    }
}