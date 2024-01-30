import { Pool } from "pg"

export const connectionString = process.env.NODE_ENV == 'production' ?  (process.env.DATABASE_URL_PRODUCTION) : 
  process.env.NODE_ENV == 'staging' ? process.env.DATABASE_URL_STAGING : process.env.DATABASE_URL_DEVELOPMENT

const connData = {
  connectionString
}

let pool : Pool | null = null

export const getPool = (): Pool => {

  if (pool == null) {
    pool = new Pool(connData)
  }

  return pool
}

// export 