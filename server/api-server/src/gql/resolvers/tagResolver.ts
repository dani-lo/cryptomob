import { dataSources } from '../datasources';
// import { pubsub } from '../pubsub';

const PUBLISHER_MUTATED = 'publisherMutated';

export default {
    Query: {
        tags() {
            return dataSources.articleService.getTags();
        },
        tag(parent: any, args: { tag_id: number }) {
            return dataSources.articleService.getTag(args.tag_id);
        }
    },

    // Mutation: {
    //     createPublisher(parent, args) {
    //         return dataSources.bookService
    //             .createPublisher({
    //                 name: args.name
    //             })
    //             .then(publisher => {
    //                 pubsub.publish(PUBLISHER_MUTATED, {
    //                     publisherMutated: {
    //                         mutation: 'CREATED',
    //                         node: publisher
    //                     }
    //                 });
    //                 return publisher;
    //             });
    //     },
    //     updatePublisher(parent, args) {
    //         return dataSources.bookService
    //             .updatePublisher(args.publisherId, {
    //                 name: args.name
    //             })
    //             .then(publisher => {
    //                 pubsub.publish(PUBLISHER_MUTATED, {
    //                     publisherMutated: {
    //                         mutation: 'UPDATED',
    //                         node: publisher
    //                     }
    //                 });
    //                 return publisher;
    //             });
    //     }
    // },

    // Subscription: {
    //     publisherMutated: {
    //         subscribe: () => pubsub.asyncIterator(PUBLISHER_MUTATED)
    //     }
    // },

    Tag: {
        articles(parent:  { article_id : number}) {
            return dataSources.articleService.getTagArticles(parent.article_id);
        }
    }
};
