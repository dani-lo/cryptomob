import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { QueryResult } from 'pg';
// import { Coin } from '@prisma/client';
import { getPool } from '../../db/pgPool';

export class CoinService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetCoins () {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query('SELECT * FROM coins;')
        } catch (err) {

            console.log(err)

            return Promise.reject('Error fetching coins')

        } finally {
            pgclient.release()
        }
    }

    async createCoin(coinName: string, coinTicker: string) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query('INSERT INTO coins (coin_name, coin_ticker) VALUES ($1, $2) RETURNING *', [coinName, coinTicker])

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating tag')
        } finally {
            pgclient.release()
        }
    }
}