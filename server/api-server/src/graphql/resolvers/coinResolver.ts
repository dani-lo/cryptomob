import { dataSources } from '../datasources';
// import { pubsub } from '../pubsub';


export default {
    Query: {
        async coins() {
            const result = await dataSources.coinService.pgGetCoins()
            return result.rows
        }
    },
    Coin: {
    //     articles(parent:  { article_id : number}) {
    //         return dataSources.articleService.getTagArticles(parent.article_id);
    //     }
    }
}
