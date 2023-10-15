import { Tag } from '@prisma/client';
import { PaginationQueryParams } from '.';
import { dataSources } from '../datasources'
// import { pubsub } from '../pubsub';

const PUBLISHER_MUTATED = 'publisherMutated';

export default {
    Query: {

        async tags(_parent: any, args: { params: PaginationQueryParams }) {

            const result = await dataSources.tagService.getTags(
                args.params.whereAuthors || null, 
                args.params.whereCategories || null
            )

            return result.map((r) => {
                return {
                    ...r,
                    articles_count: Number(r.articles_count)
                }
            })
        }
    },
    Mutation: {
        async createTag(_: any, args: { input : { tag_name: string; tag_origin: string; } }) {
            return dataSources.tagService.createTag(args.input.tag_name, args.input.tag_origin)
        },

       

        async tagArticle(_: any, args: { tag_id: number, article_id: number }) {

            const {
                tag_id,
                article_id
            } = args
 
            const article = await dataSources.articleService.tagArticle(tag_id, article_id)

            return tag_id
        }
    },
    Tag: {
        async articles(parent:  { article_id : number}) {
            return dataSources.articleService.getTagArticles(parent.article_id);
        },
        async category (parent:  { category_id : number}) {
            return dataSources.tagService.getTagCategory(parent.category_id);
        }
    }
}