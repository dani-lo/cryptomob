import express, { Application } from "express"
import bodyParser from "body-parser"
import 'dotenv/config'
import cors from 'cors'
import path from "path"
// import { PrismaClient } from '@prisma/client'

import { graphqlHTTP }from "express-graphql"

import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { mergeResolvers } from '@graphql-tools/merge'

import { resolvers } from './src/graphql/resolvers'
const schemaAddress = './src/graphql/schema.graphql'

import { acquireRss } from './src/etl/acquire'
import { spawn } from "child_process"

async function main() {

    const app: Application = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    const cors_origin = true//process.env.NODE_ENV == 'development' ? true : '<https://qrated.net>'
    
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
      resolvers.user,
      resolvers.etl
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

    app.use(
      "/etl/:appId",
      async (req, res, next)=>{
        
        const result = acquireRss(Number(req.params.appId))

        const parseScript = `${ path.resolve('..') }/libparse/main.py`
        
        let stdoutChunks: Uint8Array[] = []

        console.log(parseScript)

        try {

          const etl_proc = spawn('python3', [parseScript, '--app-id', '2'])//, ['--app-id', '2'])

          etl_proc.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
            stdoutChunks = stdoutChunks.concat(data)
          });

          etl_proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`)
          });


          etl_proc.on('close', (code) => {

            const stdoutContent = Buffer.concat(stdoutChunks).toString();
            
            console.log(`child process exited with code ${code}`);
            
            const result = JSON.parse(stdoutContent)
            console.log(result)

            res.send({
              status: 200,
              result: result
            }) 
          }); 
        } catch(err) {
          console.log('!!CALL TO LIBPARSE ERRORED!!')
          console.log(err)
        }
        
        

        // res.send({
        //   status: 200,
        //   result
        // }) 
      }
  )

    // app.get('/datestget', (req, res) => {
    //   res.send({str: 'Hello Get!'})
    // })

    // app.post('/datestpost', (req, res) => {
    //   res.send({str: 'Hello Post!'})
    // })

    const PORT = process.env.PORT || 8080

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`)
    })
}

main()
