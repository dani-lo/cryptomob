import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { Article, Prisma, Tag } from '@prisma/client'

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

    async pgGetTags (
            fromDate: string,
            toDate: string,
            filters:WhereParameters
        ) { 
        
        // return {
        //     rows: []
        // }
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            
            if (hasAnyFilter(filters)) {

                // const whereClause = await articleWhere(filters, fromDate, toDate, pgclient) as ArticleWhere
                // const strWhere = whereClauseObjToSql(whereClause)

                // const articlesResult = await pgPool.query(`
                //         SELECT * FROM articles  WHERE ${strWhere}
                //     `
                // )

                // const articlesIDs = articlesResult.rows.map(a => Number(a.article_id))
                
                // return pgPool.query(`
                //         SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin,  (
                //             SELECT COUNT(article_id) as articles_count FROM articles_tags 
                //                 WHERE articles_tags.tag_id = tags.tag_id
                //         )
                //         FROM tags 
                //         JOIN articles_tags ON articles_tags.tag_id = tags.tag_id  WHERE articles_tags.article_id IN ${ whereArrayInValues(articlesIDs) }
                //         ORDER BY tag_id;
                //     `
                // )

                return pgPool.query(`
                        SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin, 
                            ( SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id )
                        FROM tags
                        JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
                        JOIN articles ON articles.article_id = articles_tags.article_id
                        WHERE articles.app_id = ${ filters.appId };
                    `
                )
            }
    
            // return pgPool.query(`
            //         SELECT DISTINCT tag_id, tag_name, tag_origin,  (
            //             SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id
            //         ) FROM tags ORDER BY tag_id;
            //     `
            // )

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
                    INSERT INTO tags (tag_name, tag_origin) VALUES ($1, $2) RETURNING *
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