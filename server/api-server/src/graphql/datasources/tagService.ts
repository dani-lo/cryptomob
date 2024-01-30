import { DataSource } from 'apollo-datasource'

import { ArticleWhere, WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers'

import { hasAnyFilter } from '../../helpers/has'

import { getPool } from '../../db/pgPool'
import { whereArrayInValues } from '../../helpers/where'

export class TagService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetTag (tagId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`SELECT * FROM tags WHERE tag_id = ${ tagId };`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching tag')

        } finally {
            pgclient.release()
        }
    }

    async pgGetTagWatchlists (tagId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            const watchlistsIDsResult = await pgclient.query(`SELECT * FROM watchlists_tags WHERE tag_id = ${ tagId };`)
            const watchlistsIDs = watchlistsIDsResult.rows.map(r => r.watchlist_id)

            if (!watchlistsIDs?.length) {
                return Promise.resolve({ rows: [] })
            }

            return  pgclient.query(`
                SELECT * FROM watchlists 
                WHERE watchlist_id IN ${ whereArrayInValues(watchlistsIDs) };
            `)
            
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching watchlist tags')
        
        } finally {
            pgclient.release()
        }
    }

    async pgGetPaginatedTags (
        fromDate: string,
        toDate: string,
        offset: number,
        limit: number,
        filters:WhereParameters
    ) { 
    
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        if (!filters.appId) {
            throw new Error('Must pass an app id to get tags')
        }

        try {

            // SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin, 
            //             ( SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id )
            //         FROM tags
            //         JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
            //         JOIN articles ON articles.article_id = articles_tags.article_id
            //         WHERE articles.app_id = ${ filters.appId } AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL)
            //         ORDER BY tags.tag_id
            //         LIMIT ${ limit }
            //         OFFSET ${ offset };

            const tags = await pgPool.query(`
                    SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin, 
                        ( SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id )
                    FROM tags
                    JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
                    JOIN articles ON articles.article_id = articles_tags.article_id
                    WHERE articles.app_id = ${ filters.appId } AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL)
                    ORDER BY tags.tag_id;
                `
            )

            const tagsCount = await pgclient.query(`
                SELECT COUNT(DISTINCT tags.tag_id) as tagscount 
                FROM tags
                JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
                JOIN articles ON articles.article_id = articles_tags.article_id
                WHERE articles.app_id = ${ filters.appId } AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL);
            `)
            
            return  Promise.resolve({
                tags: tags.rows, 
                tagsCount: tagsCount.rows[0].tagscount
            })
        

        } catch (error) {
            console.log(error)
            return Promise.reject('Error fetching tags')
        } finally {
            pgclient.release()
        }
    }


    async pgGetTags (
            fromDate: string,
            toDate: string,
            filters:WhereParameters
        ) { 
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            
            if (hasAnyFilter(filters)) {

                return pgPool.query(`
                        SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin, 
                            ( SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id )
                        FROM tags
                        JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
                        JOIN articles ON articles.article_id = articles_tags.article_id
                        WHERE articles.app_id = ${ filters.appId } AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL);
                    `
                )
            }
            throw new Error('Must pass an app id to get tags')

        } catch (error) {
            console.log(error)
            return Promise.reject('Error fetching articles')
        } finally {
            pgclient.release()
        }
    }

    async pgcCreateTag(tagName: string, tagOrigin: string) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query(`
                    INSERT INTO tags (tag_name, tag_origin) VALUES ($1, $2) RETURNING *;
                `, 
                [
                    tagName, 
                    tagOrigin
                ]
            )

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating tag')
        } finally {
            pgclient.release()
        }
    }

    async pgDeleteWatchlistTag(tagId: number, watchlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                DELETE FROM watchlists_tags
                WHERE tag_id = ${ tagId } AND watchlist_id = ${ watchlistId };
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error deleting watchlist tag')
        } finally {
            pgclient.release()
        }
    }
}