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
}