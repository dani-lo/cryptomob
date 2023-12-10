import express, { Application } from "express"
import bodyParser from "body-parser"
import 'dotenv/config'
import path from "path"
import { spawn } from "child_process"

import { acquireRss } from "../etl/acquire"

// export const populteRoutes = (app: Application) => {

//     app.get("/articles", async (req, res) => {

//         const articles = await prisma.articles.findMany()
        
//         res.json(articles)
//     })
// }

export const appUseEtl = (app: Application) => {
    app.post(
        "/etl/:appId",
        async (req, res, next)=>{
          
            res.send({
                status: 200,
                result: 'OK'
              })

        //   const result = acquireRss(Number(req.params.appId))
  
        //   const parseScript = `${ path.resolve('..') }/libparse/main.py`
          
        //   let stdoutChunks: Uint8Array[] = []
  
        //   console.log(parseScript)
  
        //   try {
  
        //     const etl_proc = spawn('python3', [parseScript, '--app-id', '2'])//, ['--app-id', '2'])
  
        //     etl_proc.stdout.on('data', (data) => {
        //       console.log(`stdout: ${data}`)
        //       stdoutChunks = stdoutChunks.concat(data)
        //     });
  
        //     etl_proc.stderr.on('data', (data) => {
        //       console.error(`stderr: ${data}`)
        //     });
  
  
        //     etl_proc.on('close', (code) => {
  
        //       const stdoutContent = Buffer.concat(stdoutChunks).toString();
              
        //       console.log(`child process exited with code ${code}`);
              
        //       const result = JSON.parse(stdoutContent)
        //       console.log(result)
  
        //       res.send({
        //         status: 200,
        //         result: result
        //       }) 
        //     }); 
        //   } catch(err) {
        //     console.log('!!CALL TO LIBPARSE ERRORED!!')
        //     console.log(err)
        //   } 

        }
    )
}