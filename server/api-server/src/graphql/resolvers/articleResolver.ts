import { ArticlesTags, Comment, Tag, WatchlistsArticles } from '@prisma/client';
import { dataSources } from '../datasources';
import { PaginationQueryParams } from '.';
import { isReturnStatement } from 'typescript';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        paginatedArticles(_parent: any, args: { params: PaginationQueryParams }) {

            const filters = {
                authors: args.params.whereAuthors || null,
                tags: args.params.whereTags?.length ? args.params.whereTags : null,
                categories: args.params.whereCategories || null,
                hashtags: args.params.whereHashtag || null, 
                userAdded: args.params.userAdded || null, 
                
            }
            return dataSources.articleService.getPaginateArticles(
                args.params.offset, 
                args.params.sortBy, 
                args.params.sortDirection, 
                args.params.limit,
                args.params.fromDate,
                args.params.toDate,
                filters
            )
        },
    },

    Mutation: {

        async createArticle(_: any, args: { input :  {article_title: string; article_description: string; article_link: string;app_id: number; }}) { 

            const {
                article_title,
                article_description,
                article_link,
                app_id
            } = args.input
 
            const article = await dataSources.articleService.createArticle(article_title, article_description, article_link, app_id)

            return article
        },

        async bookmarkArticlez(_parent: any, args: { input: { item_id: number, val: boolean }}) {

            const val = typeof args.input.val == 'undefined' ? true : args.input.val 

            return dataSources.articleService.addBookmarkArticle(args.input.item_id, val)
        },
        async deleteArticlez(_parent: any, args: { input: { item_id: number, val: boolean }}) {

            const val = typeof args.input.val == 'undefined' ? true : args.input.val 

            return dataSources.articleService.deleteArticle(args.input.item_id, val)
        },

        async articleExtras(_parent: any, args: { input: { article_id: number, category_id: number, watchlist_id: number}}) {
            const {
                article_id,
                category_id,
                watchlist_id
            } = args.input

            return await dataSources.articleService.articleExtras(article_id, category_id, watchlist_id)
        }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Article: {
        tags(parent: { tags: ArticlesTags[] }) {
            return dataSources.articleService.getArticleTags(parent.tags)
        },
        author(parent: { article_id: number, author_id: number }) {
            return dataSources.authorService.getAuthor(parent.author_id)
        },
        comments(parent: { article_id: number }) {
            return dataSources.articleService.getArticleComments(parent.article_id);
        },
        watchlists(parent: { article_id: number }) {
            return dataSources.articleService.getArticleWatchlists(parent.article_id);
        },
        category(parent: { category_id: number | null}) {
            return parent.category_id ? dataSources.categoryService.getCategory(parent.category_id) : null;
        },
    }
}