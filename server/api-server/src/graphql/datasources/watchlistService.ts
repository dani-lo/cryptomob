import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'

export class WatchlistService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getWatchlists () {

        return await prisma.watchlist.findMany()
    }

    async getWatchlistAuthors (watchlist_id: number) {
        
        return await prisma.watchlistsAuthors.findMany({
            where: {
                watchlist_id
            }
        })
    }

    async getWatchlistTags (watchlist_id: number) {

        const watchlistTags = await prisma.watchlistsTags.findMany({
            where: {
                watchlist_id
            }
        })

        return watchlistTags
    }

    async getWatchlistCoins (watchlist_id: number) {

        const watchlistTags = await prisma.watchlistsCoins.findMany({
            where: {
                watchlist_id
            }
        })

        return watchlistTags
    }

    async getWatchlistArticles (watchlist_id: number) {

        const watchlistArticles = await prisma.watchlistsArticles.findMany({
            where: {
                watchlist_id
            }
        })

        const articlesIds = watchlistArticles.map(w => w.article_id)

        return await prisma.article.findMany({
            where: {
                article_id: {
                    in: articlesIds
                }
            }
        })
    }

    async createWatchlist(watchlistName: string, userId: number) {

        const watchlist = await prisma.watchlist.create({
            data: {
                watchlist_name: watchlistName,
                watchlist_delete: false,
                user_id: userId
            }
        })

        return watchlist 
    }

    async watchlistArticle (watchlistId: number, articleId: number) {

        const relation = await prisma.watchlistsArticles.create({
            data: {
                watchlist_id: watchlistId,
                article_id: articleId
            }
        })

        return relation
    }

    

}
