import { Application } from "express"
import 'dotenv/config'
import { connectionString } from "../db/pgPool"
import { dataSources } from '../graphql/datasources';

export const appUsePrune = (app: Application) => {
    app.get(
        "/prune-articles",
        async (req, res, next) => {
            try {
                
                const authors = await dataSources.articleService.pgPruneAuthors()
                const tags = await dataSources.articleService.pgPruneTags()
                
                res.send({
                    status: 200,
                    result: {
                        authors: authors.map(a => a.author_id),
                        tags: tags.map(t => t.tag_id),

                    }
                  })

            } catch (err) {
                console.log(err)

                res.send({
                    status: 500,
                    result: null,
                    err
                  })
            }

        }
    )
}