import { DataSource } from 'apollo-datasource'

import { getPool } from '../../db/pgPool';

export class EtlService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetRssSources (appId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        console.log(`
            SELECT * FROM sources
            WHERE sources.app_id = ${ appId } AND sources.source_type = 'rss';
        `)
        
        try {
            return pgclient.query(`
                SELECT * FROM sources
                WHERE sources.app_id = ${ appId } AND sources.source_type = 'rss';
            `)
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching comments')
        
        } finally {
            pgclient.release()
        }
    }
    
    // async pgCreateComment(text: string, articleId: number, userId: number) {

    //     const pgPool = getPool()
    //     const pgclient = await pgPool.connect()

    //     try {

    //         return pgclient.query('INSERT INTO comments (comment_text, article_id, user_id) VALUES ($1, $2, $3) RETURNING *', [text, articleId, userId])

    //     } catch (error) {
    //         console.log(error)
    //         return Promise.reject('Error creating comment')
    //     } finally {
    //         pgclient.release()
    //     }
    // }   
}