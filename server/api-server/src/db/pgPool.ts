import { Pool } from "pg"

const connectionString = process.env.NODE_ENV == 'production' ?  (process.env.DATABASE_URL_PRODUCTION) : 
  process.env.NODE_ENV == 'staging' ? process.env.DATABASE_URL_STAGING : process.env.DATABASE_URL_DEVELOPMENT

const connData = {
  connectionString
}

console.log('NODE API --- connectionString ---- (process.env.NODE_ENV is::', process.env.NODE_ENV)
console.log(connectionString)

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
// pgPool.on('error', (err: string) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// })

let pool : Pool | null = null

export const getPool = (): Pool => {

  if (pool == null) {
    pool = new Pool(connData)
  }

  return pool
}

// export 