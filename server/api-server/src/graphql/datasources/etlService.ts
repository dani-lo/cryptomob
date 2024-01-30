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
}