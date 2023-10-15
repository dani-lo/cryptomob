import { dataSources } from '../datasources';
// import { pubsub } from '../pubsub';


export default {
    Query: {
        async coins() {

            return await dataSources.coinService.getCoins()
        }
    },
    Coin: {
    //     articles(parent:  { article_id : number}) {
    //         return dataSources.articleService.getTagArticles(parent.article_id);
    //     }
    }
}
