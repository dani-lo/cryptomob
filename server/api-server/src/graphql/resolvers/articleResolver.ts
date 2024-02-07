// import { ArticlesTags, Comment, Tag, WatchlistsArticles } from '@prisma/client';
import { dataSources } from '../datasources';
import { PaginationQueryParams } from '.';
import { hasNamedProp } from '../../helpers/obj';
// import { pubsub } from '../pubsub';



export default {
    
    Query: {
        async paginatedArticles(_parent: any, args: { params: PaginationQueryParams }, ctx: any) {
            
            

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

            const result = await dataSources.articleService.pgGetPaginateArticles(
                args.params.offset, 
                args.params.sortBy, 
                args.params.sortDirection, 
                args.params.limit,
                args.params.fromDate,
                args.params.toDate,
                filters
            )
            
            return {
                articles: result.articles,
                recordsCount: result.articlesCount
            }
        },
    },

    Mutation: {

        async createArticle(_: any, args: { input :  {
            article_title: string; 
            article_description: string; 
            article_link: string;
            app_id: number;
            author_id: number 
        }}) { 

            const {
                article_title,
                article_description,
                article_link,
                app_id,
                author_id
            } = args.input
 
            const createdRows = await dataSources.articleService.pgCreateArticle(article_title, article_description, article_link, app_id, author_id)

            return createdRows?.rows?.length ? createdRows.rows[0] : null
        },

        async bookmarkArticlez(_parent: any, args: { input: { item_id: number, val: boolean }}, contextValue: any) {

            console.log('============== contextValue')
            console.log(contextValue)

            const val = typeof args.input.val == 'undefined' ? true : args.input.val 
            const articleRows = await dataSources.articleService.pgAddBookmarkArticle(args.input.item_id, val)

            return articleRows?.rows?.length ? articleRows.rows[0] : null
        },

        async deleteArticlez(_parent: any, args: { input: { item_id: number, val: boolean }}) {

            const val = typeof args.input.val == 'undefined' ? true : args.input.val 
            const articleRows = await  dataSources.articleService.pgDeleteArticle(args.input.item_id, val)

            return articleRows?.rows?.length ? articleRows.rows[0] : null
        },

        async setCategoriseArticle (_parent: any, args: { input: { article_id: number, category_id: number}}) {
            const {
                article_id,
                category_id
            } = args.input


            const articleRows = await dataSources.articleService.pgCategoriseArticle(article_id, category_id)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        },

        async setWatchlistArticle (_parent: any, args: { input: { article_id: number, watchlist_id: number}}) {
            
            const {
                article_id,
                watchlist_id
            } = args.input


            const articleRows = await dataSources.articleService.pgWatchlistArticle(article_id, watchlist_id)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        },

        async deleteWatchlistArticle (_parent: any, args: { input: { article_id: number, watchlist_id: number}}) {
            
            const {
                article_id,
                watchlist_id
            } = args.input


            const articleRows = await dataSources.articleService.pgDeleteWatchlistArticle(article_id, watchlist_id)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        },

        async setArticleTag (_parent: any, args: { input: { article_id: number, tag_id: number, user_id: number}}) {

            const {
                article_id,
                tag_id,
                user_id
            } = args.input


            const articleRows = await dataSources.articleService.pgTagArticle(article_id, tag_id, user_id)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        },

        async unsetArticleTag (_parent: any, args: { input: { article_id: number, tag_id: number, user_id: number}}) {

            const {
                article_id,
                tag_id,
                user_id
            } = args.input


            const articleRows = await dataSources.articleService.pgUntagArticle(article_id, tag_id)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        },


        async setArticleBg (_parent: any, args: { input: { color: string, article_id: number}}) {
            const {
                article_id,
                color
            } = args.input


            const articleRows = await dataSources.articleService.pgColorArticle(article_id, color)
            const article = articleRows?.rows?.length ? articleRows.rows[0] : null

            return article
        }
    },

    // Subscription: {
    //     bookMutated: {
    //         subscribe: () => pubsub.asyncIterator(BOOK_MUTATED)
    //     }
    // },

    Article: {
        async tags(parent: { article_id: number }) {

            // return []
            const result = await dataSources.articleService.pgGetArticleTags(parent.article_id)

            return result.rows || []
        },
        async author(parent: { article_id: number, author_id: number }) {
            // return null

            const result = await dataSources.authorService.pgGetAuthor(parent.author_id) 

            return result.rows[0]
        },
        async comments(parent: { article_id: number }) {
            // return []
            const result = await  dataSources.articleService.pgGetArticleComments(parent.article_id);
            
            return result.rows || []
        },
        async watchlists(parent: { article_id: number }) {
            // return []
            const result = await  dataSources.articleService.pgGetArticleWatchlists(parent.article_id)
            return result.rows || []
        },
        async category(parent: { category_id: number | null}) {
            // return null
            const cat = parent.category_id ? await dataSources.categoryService.pgGetCategory(parent.category_id) : null
            
            return cat?.rows?.length ?  cat.rows[0] : null;
        },
    }
}