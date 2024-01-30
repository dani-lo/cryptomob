import { Application } from "express"
import 'dotenv/config'
import { connectionString } from "../db/pgPool"
import { dataSources } from '../graphql/datasources';

export const appUsePing = (app: Application) => {
    app.get(
        "/ping",
        async (req, res, next) => {
            try {
                const author = await dataSources.authorService.pgGetAuthor(3)

                res.send({
                    status: 200,
                    result: {
                        connectionString: connectionString,
                        author: author,
                        env: process.env

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