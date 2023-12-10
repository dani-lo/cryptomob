// import { ArticlesTags, Tag } from '@prisma/client';
import { DatedWhereParams } from '.';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        paginatedComments(_parent: any, args: { params: { limit: number, offset: number, sortBy: string, sortDirection: string, fromDate: string, toDate: string } }) {
            
            return []
        },
        async comments (_parent: any, args: { params: DatedWhereParams }) {

            const filters = {
                appId: args.params.appId,
            }

            return await dataSources.commentService.pgGetComments(filters.appId)
        }
    },

    Mutation: {
        
        async createComment(_: any, args: { input : { comment_text: string; article_id: number; user_id: number; } }) {

            const {
                comment_text,
                article_id,
                user_id
            } = args.input
 
            const commentRows = await dataSources.commentService.pgCreateComment(comment_text, article_id, user_id)
            const comment = commentRows?.rows?.length ? commentRows.rows[0] : {}
            console.log(comment)
            return comment
        },
    },

    Comment: {
        article(parent: { article_id: number }) {
            return dataSources.articleService.pgGetArticle(parent.article_id);
        },
        async user(parent: { user_id: number }) {

            const user = await dataSources.userService.pgGetUser(parent.user_id)

            return user?.rows?.length ? user.rows[0] : {}
        }
    }
}