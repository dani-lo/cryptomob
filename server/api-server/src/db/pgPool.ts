import { Pool } from "pg"

// const pgPool = new Pool()

const connData = {
  user: "postgres",
  database: "cryptomob",
  password: "postgres",
  port: 5432,
  host: "localhost",
}

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