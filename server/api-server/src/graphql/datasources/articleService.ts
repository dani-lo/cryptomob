import { DataSource } from 'apollo-datasource'

import { ArticleWhere, WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers';
import { getPool } from '../../db/pgPool';
import { whereArrayInValues } from '../../helpers/where';

export class ArticleService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetTagArticles (tagId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
           
            return pgclient.query(`
                SELECT * FROM articles
                LEFT JOIN articles_tags 
                ON articles_tags.article_id = articles.article_id
                WHERE articles_tags.tag_id = ${ tagId }
                AND ( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL );
            `)
        } catch (err) {

            console.log('err', err)
            
            return Promise.reject('Error fetching tag articles')

        } finally {
            pgclient.release()
        }
    }

    async pgGetAuthorArticles(authorId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query('SELECT * FROM articles WHERE author_id = $1 AND ( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL );', [authorId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching tag articles')

        } finally {
            pgclient.release()
        }
    }

    async pgGetAuthorsArticles(authorIDs: number[]) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`SELECT * FROM articles WHERE author_id IN ${ whereArrayInValues(authorIDs) } AND( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL );`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching tag articles')

        } finally {
            pgclient.release()
        }
        
    }
    
    async pgGetPaginateArticles(
            offset: number, 
            sortBy: string, 
            sortDirection: string, 
            limit: number, 
            fromDate: string,
            toDate: string,
            filters:WhereParameters) {
        
        // return {
        //     rows: []
        // }
        const sortDirectionPg = sortDirection.toLowerCase() == 'asc' ? 'ASC' : 'DESC'
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        const whereClause = await articleWhere(filters, fromDate, toDate, pgclient) as ArticleWhere
        const strArticlesWhere = whereClauseObjToSql(whereClause, 'articles')
        
        const strOrderBy = ` article_id ${ sortDirectionPg } `

        try {

            const articles = await pgclient.query(`
                SELECT * FROM articles
                WHERE ${ strArticlesWhere }
                AND ( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL )
                ORDER BY ${ strOrderBy }
                LIMIT ${ limit }
                OFFSET ${ offset }
            `)

            const articlesCount = await pgclient.query(`
                SELECT COUNT(article_id) as articlescount FROM articles
                WHERE ${ strArticlesWhere }
                AND ( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL )
            `)
            
            return  Promise.resolve({
                articles: articles.rows, 
                articlesCount: articlesCount.rows[0].articlescount
            })
        
        } catch (err) {
                        
            return Promise.reject('Error fetching  articles')

        } finally {
            pgclient.release()
        }
    }

    async pgGetArticle(articleId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`SELECT * FROM articles WHERE article_id = ${ articleId };`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching tag articles')

        } finally {
            pgclient.release()
        }
    }

    async pgCreateArticle(articleTitle: string, articleDescription: string, articleLink: string, articleAPpId: number, authorId: number) {

        const articleData = {

            article_title: articleTitle,
            article_description: articleDescription,
            article_link: articleLink,
            article_datepub: new Date().toISOString(),
            article_content: '',
            article_bookmark: false,
            article_delete: false,
            article_origin: 'user',
            app_id: articleAPpId,
            author_id: authorId,
        }

            const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
        
            return await pgclient.query(`
                INSERT INTO articles (
                    article_title,
                    article_description,
                    article_link,
                    article_datepub,
                    article_content,
                    article_bookmark,
                    article_delete,
                    article_origin,
                    app_id,
                    author_id
                )
                VALUES(
                    '${ articleData.article_title }',
                    '${ articleData.article_description }',
                    '${ articleData.article_link }',
                    '${ articleData.article_datepub }',
                    '${ articleData.article_content }',
                    ${ articleData.article_bookmark },
                    ${ articleData.article_delete },
                    '${ articleData.article_origin }',
                    ${ articleData.app_id },
                    ${ articleData.author_id }
                )
                RETURNING *
            `)

        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error creating article')

        } finally {
            pgclient.release()
        }
    }

    async pgGetArticleTags(articleId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query(`
                    SELECT * FROM tags
                    RIGHT JOIN articles_tags 
                    ON articles_tags.tag_id = tags.tag_id 
                    WHERE articles_tags.article_id = ${ articleId };
                `
            )

        } catch (error) {
            console.log(error)
            return Promise.reject('Error getting paginated articles')
        } finally {
            pgclient.release()
        }
    }

    async pgGetArticleAuthor(authorId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`SELECT * FROM authors WHERE author_id = ${ authorId };`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching article auhtor')

        } finally {
            pgclient.release()
        }
     }

    async pgGetArticleComments(articleId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                    SELECT * FROM comments
                    WHERE comments.article_id = ${ articleId };
                `
            ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error getting article comments')
        } finally {
            pgclient.release()
        }
    }

    async pgGetArticleWatchlists (articleId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                SELECT * FROM watchlists
                RIGHT JOIN watchlists_articles 
                ON watchlists_articles.watchlist_id = watchlists.watchlist_id 
                RIGHT JOIN articles 
                ON articles.article_id = watchlists_articles.article_id
                WHERE watchlists_articles.article_id = ${ articleId } AND( articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL );
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error getting article watchlists')
        } finally {
            pgclient.release()
        }
    }

    async pgAddBookmarkArticle (articleId: number, val: boolean) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                UPDATE articles
                SET article_bookmark = ${ val }
                WHERE article_id = ${ articleId }
                RETURNING *;
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error bookmarking article')
        } finally {
            pgclient.release()
        }
    }

    async pgDeleteArticle (articleId: number, val: boolean) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                UPDATE articles
                SET article_delete = ${ val }
                WHERE article_id = ${ articleId }
                RETURNING *;
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error deleting article')
        } finally {
            pgclient.release()
        }
    }

    async pgCategoriseArticle (articleId: number, categoryId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                UPDATE articles
                SET category_id = ${ categoryId }
                WHERE article_id = ${ articleId }
                RETURNING *;
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error categorising article')
        } finally {
            pgclient.release()
        }
    }

    async pgTagArticle ( articleId: number, tagId: number, userId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        console.log(`
        INSERT INTO articles_tags (article_id, tag_id, user_id)
        VALUES(${ articleId }, ${ tagId }, ${ userId })
        RETURNING *;
    `)
        try {   
            return pgclient.query(`
                INSERT INTO articles_tags (article_id, tag_id, user_id)
                VALUES(${ articleId }, ${ tagId }, ${ userId })
                RETURNING *;
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error tagging article')
        } finally {
            pgclient.release()
        }
    }

    async pgUntagArticle ( articleId: number, tagId: number,) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            await pgclient.query(`
                DELETE FROM  articles_tags
                WHERE article_id = ${ articleId } AND tag_id = ${ tagId };
                RETURNING *;
            `)

            return this.pgGetArticle(articleId)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error tagging article')
        } finally {
            pgclient.release()
        }
    }

    async pgWatchlistArticle(articleId: number, wathlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            const res = await  pgclient.query(`
                INSERT INTO watchlists_articles (article_id, watchlist_id)
                VALUES(${ articleId }, ${ wathlistId });
            `
        ) 

        return this.pgGetArticle(articleId)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error watchlisting article')
        } finally {
            pgclient.release()
        }
    }

    async pgDeleteWatchlistArticle(articleId: number, wathlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            await  pgclient.query(`
                DELETE FROM watchlists_articles 
                WHERE article_id = ${ articleId } AND watchlist_id = ${ wathlistId };
            `) 

            return this.pgGetArticle(articleId)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error un-watchlisting article')
        } finally {
            pgclient.release()
        }
    }

    async pgColorArticle(articleId: number, color: string) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            await  pgclient.query(`
                UPDATE articles
                SET article_bg = '${ color }'
                WHERE article_id = ${ articleId }
                RETURNING *;
            `) 

            return this.pgGetArticle(articleId)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error coloring article bg')
        } finally {
            pgclient.release()
        }
    }
}

