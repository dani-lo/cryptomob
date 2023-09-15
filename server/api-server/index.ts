// import express, { Application, Request, Response } from "express"
// import bodyParser from "body-parser"
// import * as dotenv from "dotenv"
// import cors from 'cors'

// dotenv.config()

// console.log(process.env.SECRET_CODE)


// const app: Application = express()

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// const cors_origin = process.env.NODE_ENV == 'development' ? true : '<https://cryptomob.net>'

// app.use(cors({ origin: cors_origin }))

// app.get("/", (req: Request, res: Response) => {
//   res.send("Healthy")
// })

// const PORT = process.env.PORT || 8000

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT ${PORT}`)
// })


import express, { Application, Request, Response } from "express"
import bodyParser from "body-parser"
import 'dotenv/config'
import cors from 'cors'

import { graphqlHTTP }from "express-graphql"
// import { buildSchema } from "graphql"

import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
const { mergeResolvers } = require('@graphql-tools/merge')

import { resolvers } from './src/gql/resolvers'

async function main() {

    const app: Application = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    const cors_origin = process.env.NODE_ENV == 'development' ? true : '<https://cryptomob.net>'
    
    app.use(cors({ origin: cors_origin }))
    
    const schema = await loadSchema('./src/gql/typedefs/schema.graphql', { loaders: [new GraphQLFileLoader()] })
    const appResolvers = [resolvers.author, resolvers.article, resolvers.tag]
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

    const PORT = process.env.PORT || 8000

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`)
    })
}

main()
