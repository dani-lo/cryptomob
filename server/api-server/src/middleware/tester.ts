import express, { Application } from "express"
import bodyParser from "body-parser"
import 'dotenv/config'
import path from "path"
import { spawn } from "child_process"

import { acquireRss } from "../etl/acquire"
import { getPool } from "../db/pgPool"

// export const populteRoutes = (app: Application) => {

//     app.get("/articles", async (req, res) => {

//         const articles = await prisma.articles.findMany()
        
//         res.json(articles)
//     })
// }

export const appUseFoo = (app: Application) => {
    app.get(
        "/foo",
        async (req, res, next) => {
            
            

            try {
                const pgPool = getPool()
                const pgclient = await pgPool.connect()

                const authorRows = pgclient.query('SELECT * FROM authors ')

                res.send({
                    status: 200,
                    result: authorRows
                  })

            } catch (err) {
                console.log(err)

                res.send({
                    status: 500,
                    result: null
                  })
            }

            // try {
                
            //     const authorRows = pgclient.query('SELECT * FROM authors ')

            //     res.send({
            //         status: 200,
            //         result: authorRows
            //       })

            // } catch (err) {

            //     console.log(err)
            // } finally {
            //     pgclient.release()
            // }

        }
    )
}