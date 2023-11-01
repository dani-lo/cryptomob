import express, { Application } from "express"
import bodyParser from "body-parser"
import 'dotenv/config'
import cors from 'cors'
// import { PrismaClient } from '@prisma/client'

import { graphqlHTTP }from "express-graphql"

import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { mergeResolvers } from '@graphql-tools/merge'

import { resolvers } from './src/graphql/resolvers'
const schemaAddress = './src/graphql/schema.graphql'

async function main() {

    const app: Application = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    const cors_origin = true//process.env.NODE_ENV == 'development' ? true : '<https://cryptomob.net>'
    
    app.use(cors({ origin: cors_origin }))
    
    const schema = await loadSchema(schemaAddress, { loaders: [new GraphQLFileLoader()] })
    const appResolvers = [
      resolvers.author, 
      resolvers.article, 
      resolvers.tag, 
      resolvers.comment, 
      resolvers.watchlist, 
      resolvers.coin, 
      resolvers.category,
      resolvers.user
    ]
    const schemaWithResolvers = addResolversToSchema({ schema, resolvers: mergeResolvers(appResolvers) })
    const root = {
        hello: () => {
            return "Hello world!"
        },
    }

    app.use(
        "/graphql",
        graphqlHTTP({
          schema: schemaWithResolvers,
          rootValue: root,
          graphiql: true,
        })
    )

    // app.get('/datestget', (req, res) => {
    //   res.send({str: 'Hello Get!'})
    // })

    // app.post('/datestpost', (req, res) => {
    //   res.send({str: 'Hello Post!'})
    // })

    const PORT = process.env.PORT || 8000

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`)
    })
}

main()
