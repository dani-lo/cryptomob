import { DataSource } from 'apollo-datasource'

import { getPool } from '../../db/pgPool';

export class MetaService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetAppCounts (appId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()
        
        try {
            const tagRows = await pgclient.query(`
                SELECT COUNT(tags.tag_id) as tags_count 
                FROM tags
                JOIN articles_tags ON  articles_tags.tag_id = tags.tag_id
                JOIN articles ON articles.article_id = articles_tags.article_id
                WHERE articles.app_id = ${ appId }
        `)

            return tagRows
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