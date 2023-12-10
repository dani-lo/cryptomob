// import { ArticlesTags, Tag } from '@prisma/client';
import { DatedWhereParams } from '.';
import { dataSources } from '../datasources';
// import { pubsub } from '../pubsub';

export default {
    
    Query: {
        async rssSources (_parent: any, args: { params: DatedWhereParams }) {
            // console.log('RESOLVER -------------')
            // console.log(args)

            const filters = {
                appId: args.params.appId,
            }

            const result = await dataSources.etlService.pgGetRssSources(filters.appId)

            return result.rows || []
        }
    }
};