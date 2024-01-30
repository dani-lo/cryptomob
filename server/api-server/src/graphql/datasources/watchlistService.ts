import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
import { getPool } from '../../db/pgPool';
import { whereArrayInValues } from '../../helpers/where';

export class WatchlistService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetWatchlists (appId: number) {
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query(`SELECT * FROM watchlists WHERE app_id = ${ appId }`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching watchlists')

        } finally {
            pgclient.release()
        }
    }

    async pgGetWatchlistAuthors (watchlistId: number) {
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            const authorsIDsResult = await pgclient.query(`SELECT * FROM watchlists_authors WHERE watchlist_id = ${ watchlistId }`)
            const authorsIDs = authorsIDsResult.rows.map(r => r.author_id)

            if (!authorsIDs?.length) {
                return Promise.resolve({ rows: [] })
            }

            return pgclient.query(
                `SELECT * FROM authors WHERE author_id IN ${ whereArrayInValues(authorsIDs) }`)
            
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching watchlist authors')
        
        } finally {
            pgclient.release()
        }
    }

    async pgGetWatchlistTags (watchlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            const tagsIDsResult = await pgclient.query(`SELECT * FROM watchlists_tags WHERE watchlist_id = ${ watchlistId };`)
            const tagsIDs = tagsIDsResult.rows.map(r => r.tag_id)

            if (!tagsIDs?.length) {
                return Promise.resolve({ rows: [] })
            }

            return  pgclient.query(`
                SELECT * FROM tags 
                WHERE tag_id IN ${ whereArrayInValues(tagsIDs) };
            `)
            
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching watchlist tags')
        
        } finally {
            pgclient.release()
        }
    }

    async pgGetWatchlistCoins (watchlistId: number) {
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            const coinsIDsResult = await pgclient.query(`SELECT * FROM watchlists_coins WHERE watchlist_id = ${ watchlistId };`)
            const coinsIDs = coinsIDsResult.rows.map(r => r.caoin_id)

            if (!coinsIDs?.length) {
                return Promise.resolve({ rows: [] })
            }

            return pgclient.query(
                `SELECT * FROM coins WHERE coin_id IN ${ whereArrayInValues(coinsIDs) };`)
            
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching watchlist coins')
        
        } finally {
            pgclient.release()
        }
    }

    async pgGetWatchlistArticles (watchlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            const articlesIDsResult = await pgclient.query(`SELECT * FROM watchlists_articles WHERE watchlist_id = ${ watchlistId};`)
            const articlesIDs = articlesIDsResult.rows.map(r => r.article_id)

            if (!articlesIDs?.length) {
                return Promise.resolve({ rows: [] })
            }

            return pgclient.query(
                `SELECT * FROM articles WHERE article_id IN ${ whereArrayInValues(articlesIDs) }  AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL);`)
            
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching watchlist articles')
        
        } finally {
            pgclient.release()
        }
    }

    async pgCreateWatchlist(watchlistName: string, userId: number, appId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query(`
                INSERT INTO watchlists (watchlist_name, watchlist_delete, user_id, app_id) 
                VALUES ('${ watchlistName }', false, ${ userId }, ${ appId })
                RETURNING *;
            `)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating watchlist')
        } finally {
            pgclient.release()
        }
    }

    async pgWatchlistArticle(watchlistId: number, articleId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query(`
                INSERT INTO watchlists_articles (watchlist_id, article_id) 
                VALUES (${ watchlistId }, ${ articleId }) 
                RETURNING *;
            `)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating watchlist article')
        } finally {
            pgclient.release()
        }
    }

    async pgWatchlistTag (watchlistId: number, tagId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()
        
        try {

            return pgclient.query(`
                INSERT INTO watchlists_tags (watchlist_id, tag_id) 
                VALUES (${ watchlistId }, ${ tagId }) 
                RETURNING *;
            `)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating watchlist article')
        } finally {
            pgclient.release()
        }
    }

    async pgWatchlistAuthor (watchlistId: number, authorId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()
        
        try {

            return pgclient.query(`
                INSERT INTO watchlists_authors (watchlist_id, author_id) 
                VALUES (${ watchlistId }, ${ authorId }) 
                RETURNING *;
            `)

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating watchlist article')
        } finally {
            pgclient.release()
        }
    }
}