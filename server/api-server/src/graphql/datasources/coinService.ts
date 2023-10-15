import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'

export class CoinService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getCoins () {
        return await prisma.coin.findMany()
    }

    async createCoin(coinName: string, coinTicker: string) {

        const coin = await prisma.coin.create({
            data: {
                coin_name: coinName,
                coin_ticker: coinTicker
            }
        })

        return coin 
    }
}
