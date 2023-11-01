// import { ArticlesTags, Tag } from '@prisma/client';
import { dataSources } from '../datasources';
import { text } from 'stream/consumers';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        paginatedComments(_parent: any, args: { params: { limit: number, offset: number, sortBy: string, sortDirection: string, fromDate: string, toDate: string } }) {
            
            //return dataSources.articleService.getPaginateArticles(args.params.offset, args.params.sortBy, args.params.sortDirection, args.params.limit)
            return []
        },
        async comments () {
            return await dataSources.commentService.pgGetComments()
        }
    },

    Mutation: {
        
        async createComment(_: any, args: { input : { comment_text: string; article_id: number; user_id: number; } }) {

            const {
                comment_text,
                article_id,
                user_id
            } = args.input
 
            const comment = await dataSources.commentService.pgCreateComment(comment_text, article_id, user_id)

            return comment

            // const { publisherId, ...rest } = args.book;
            
            // return dataSources.bookService
            //     .createBook(
                //         {
            //             ...rest
            //         },
            //         publisherId
            //     )
            //     .then(book => {
            //         pubsub.publish(BOOK_MUTATED, {
            //             bookMutated: {
            //                 mutation: 'CREATED',
            //                 node: book
            //             }
            //         });
            //         return book;
            //     });
        },
        // updateBook(parent, args) {
        //     const { publisherId, ...rest } = args.book;
        //     return dataSources.bookService
        //         .updateBook(
        //             args.bookId,
        //             {
        //                 ...rest
        //             },
        //             publisherId
        //         )
        //         .then(publishBookUpdated);
        // },
        // setBookAuthors(parent, args) {
        //     return dataSources.bookService
        //         .setBookAuthors(args.bookId, args.authorIds)
        //         .then(publishBookUpdated);
        // }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Comment: {
        article(parent: { article_id: number }) {
            return dataSources.articleService.pgGetArticle(parent.article_id);
        },
        async user(parent: { user_id: number }) {

            const user = await dataSources.userService.pgGetUser(parent.user_id)

            return user.rows[0]
        }
    }
};

// function publishBookUpdated(book) {
//     pubsub.publish(BOOK_MUTATED, {
//         bookMutated: {
//             mutation: 'UPDATED',
//             node: book
//         }
//     });
//     return book;
// }
