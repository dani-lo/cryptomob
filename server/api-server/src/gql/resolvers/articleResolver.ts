import { dataSources } from '../datasources';
// import { pubsub } from '../pubsub';

const BOOK_MUTATED = 'bookMutated';

export default {
    
    Query: {
        articles() {
            return dataSources.articleService.getArticles();
        },
        article(parent:any, args: { atricle_id: number }) {
            return dataSources.articleService.getArticle(args.atricle_id);
        }
    },

    // Mutation: {
    //     createBook(parent, args) {
    //         const { publisherId, ...rest } = args.book;
    //         return dataSources.bookService
    //             .createBook(
    //                 {
    //                     ...rest
    //                 },
    //                 publisherId
    //             )
    //             .then(book => {
    //                 pubsub.publish(BOOK_MUTATED, {
    //                     bookMutated: {
    //                         mutation: 'CREATED',
    //                         node: book
    //                     }
    //                 });
    //                 return book;
    //             });
    //     },
    //     updateBook(parent, args) {
    //         const { publisherId, ...rest } = args.book;
    //         return dataSources.bookService
    //             .updateBook(
    //                 args.bookId,
    //                 {
    //                     ...rest
    //                 },
    //                 publisherId
    //             )
    //             .then(publishBookUpdated);
    //     },
    //     setBookAuthors(parent, args) {
    //         return dataSources.bookService
    //             .setBookAuthors(args.bookId, args.authorIds)
    //             .then(publishBookUpdated);
    //     }
    // },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Article: {
        tags(parent: { atricle_id: number }) {
            return dataSources.articleService.getArticleTags(parent.atricle_id);
        },
        author(parent: { atricle_id: number }) {
            return dataSources.articleService.getArticleTags(parent.atricle_id);
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
