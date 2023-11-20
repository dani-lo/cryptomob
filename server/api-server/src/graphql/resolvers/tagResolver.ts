// import { Tag } from '@prisma/client';

import { DatedWhereParams, PaginationQueryParams } from '.'
import { dataSources } from '../datasources'
import { hasNamedProp } from '../../helpers/obj'

export default {
    Query: {

        async tags(_parent: any, args: { params: DatedWhereParams }) {
            console.log(args)
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

            // const result = await dataSources.tagService.getTags(
            //     args.params.fromDate,
            //     args.params.toDate,
            //     filters
            // )

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
        }
    },
    Mutation: {
        async createTag(_: any, args: { input : { tag_name: string; tag_origin: string; } }) {

            const newTag = await dataSources.tagService.pgcCreateTag(args.input.tag_name, args.input.tag_origin)

            return newTag.rows[0]
        },

        async tagArticle(_: any, args: { tag_id: number, article_id: number }) {

            const {
                tag_id,
                article_id
            } = args
 
            await dataSources.articleService.pgTagArticle(tag_id, article_id)

            return tag_id
        },

        async setWatchlistTag(_: any, args: { input: { tag_id: number, watchlist_id: number } }) {

            const {
                tag_id,
                watchlist_id
            } = args.input
            
            await dataSources.watchlistService.pgWatchlistTag(watchlist_id, tag_id)
            
            const result = await dataSources.tagService.pgGetTag(tag_id)

            return  result?.rows ? result.rows[0] : []
        },

        async deleteWatchlistTag(_: any, args: { input: { tag_id: number, watchlist_id: number } } ) {
            
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