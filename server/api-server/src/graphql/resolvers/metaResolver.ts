
import { DatedWhereParams } from '.';
import { dataSources } from '../datasources';

export default {
    
    Query: {
        async appCounts (_parent: any, args: { params: DatedWhereParams }) {

            const filters = {
                appId: args.params.appId,
            }
            const result = await dataSources.metaService.pgGetAppCounts(filters.appId)

            return result?.rows?.length ? result.rows[0] : {}
        }
    }
}