import { PoolClient } from "pg"

import { intersection } from "../../helpers/arr"
import { whereArrayInValues } from "../../helpers/where"

import articleResolver from "./articleResolver"
import authorResolver from "./authorResolver"
import tagResolver from "./tagResolver"
import commentResolver from "./commentResolver"
import watchlistResolver from "./watchlistResolver"
import coinResolver from './coinResolver'
import categoryResolver from "./categoryResolver"
import userResolver from './userResolver'
// import { PrismaClient } from "@prisma/client"

import etlResolver from "./etlResolver"

export const resolvers = {
    'article': articleResolver,
    'author':authorResolver,
    'tag': tagResolver,
    'comment': commentResolver,
    'watchlist': watchlistResolver, 
    'coin': coinResolver,
    'category': categoryResolver,
    'user': userResolver,
    'etl': etlResolver
}

export type WhereParameters = 
    {
        appId: number,
        whereAuthors?:number[] | null,
        whereTags?: number[] | null,
        whereCategories?: number[] | null,
        whereHashtags?: number[] | null,
        tagged ?: boolean | null;
        userTagged?: boolean | null;
        commented?: boolean | null;
        watchlisted?: boolean | null;
        categoryized?: boolean | null;
        authored?: boolean | null;
        userAdded?: boolean | null;
        bookmarked ?: boolean | null;
}

export type DatedWhereParams = {
    fromDate: string;
    toDate: string; 
} & WhereParameters

export type PaginationQueryParams = {
    offset: number;
    limit: number;
    sortBy: string;
    sortDirection: string;
} & DatedWhereParams

export interface ArticleWhere {
    article_id?:  { in: number[]};
    author_id?: { in: number[]} | { not: null };
    category_id?: { in: number[]} | { not: null };
    article_datepub?: {
        gte: string;
        lte: string;
    };
    article_origin?: string;
    article_bookmark?: boolean;
    app_id: number
}

export const whereClauseObjToSql = (whereObj: ArticleWhere, prefix ?: string) => {

    const keys = Object.keys(whereObj) as (keyof ArticleWhere)[]

    const strClauses = keys.map(key => {

        const expressedClause = whereObj[key]
        const prefixedKey = `${ prefix ? (prefix + '.') : '' }${ key }`

        if (expressedClause && ['string', 'boolean', 'number'].includes(typeof expressedClause)) {
            
            return ` ${ prefixedKey } = ${ expressedClause } `

        } else if (expressedClause && expressedClause.hasOwnProperty('not')) {

            return ` ${ prefixedKey } IS NOT NULL `

        } else if (expressedClause && expressedClause.hasOwnProperty('in')) {
            
                // @ts-ignore
            const arrayIn: number[] = expressedClause.in

            return ` ${ prefixedKey } IN ${whereArrayInValues(arrayIn)} `

        } else if (expressedClause && expressedClause.hasOwnProperty('lte') && expressedClause.hasOwnProperty('gte')) {
            
            // @ts-ignore
            const { gte, lte }: { gte: string, lte: string } = expressedClause

            return " articles.article_datepub < '2029-12-31T18:15:00.000Z' AND articles.article_datepub > '1999-12-31T18:15:00.000Z' "
        } 

        return null
    })

    return (strClauses || []).filter(d => d !== null).join(' AND ')
}

// (${Prisma.join()})

export const articleWhere = async (
        filters:WhereParameters, 
        fromDate: string, 
        toDate: string, 
        pgPoolClient: PoolClient,
        existingWhereClauseObj ?: ArticleWhere
    ) => {
        
        const articlesWhereClause : ArticleWhere = existingWhereClauseObj || { app_id: 0 }
        
        articlesWhereClause['app_id'] = filters.appId

        try {

            if (filters.whereTags?.length) {

                const articles_tags_ids = await pgPoolClient.query(`
                    SELECT * FROM articles_tags 
                    WHERE tag_id IN ${ whereArrayInValues(filters.whereTags) };
                `)

                const articlesIDs = (articles_tags_ids.rows || []).map(d => d.article_id)
                const intersected = intersection(articlesWhereClause.article_id?.in || [], articlesIDs)

                articlesWhereClause.article_id = {
                    in: intersected
                }
            }

            if (filters.whereAuthors?.length) {
                
                articlesWhereClause.author_id = {
                    in: filters.whereAuthors
                }
            }

            if (filters.whereCategories?.length) {
                
                articlesWhereClause.category_id = {
                    in: filters.whereCategories
                }
            }

            if (fromDate && toDate) {
                
                articlesWhereClause.article_datepub = {
                    gte: new Date(fromDate).toISOString(),
                    lte: new Date(toDate).toISOString()
                }
            }

            if (filters.userAdded === true) {
                
                articlesWhereClause.article_origin = "'user'"
            }

            if (filters.categoryized) {
                articlesWhereClause.category_id = {
                    not: null
                }
            }

            if (filters.authored) {

                const knownAuthors = await pgPoolClient.query(`
                        SELECT * FROM authors WHERE author_name IS NOT NULL AND author_name != 'unknown';
                    `
                )
                articlesWhereClause.author_id = {
                    in: (knownAuthors.rows || []).map(a => a.author_id)
                }
            }

            if (filters.tagged) {

                const articlesTagIds = await pgPoolClient.query(`
                        SELECT * FROM articles_tags;
                    `
                )

                const articleIDs = (articlesTagIds.rows || []).map(d => d.article_id)
                const intersected = intersection(articlesWhereClause.article_id?.in || [], articleIDs)

                articlesWhereClause.article_id = {
                    in: intersected
                }
            }

            if (filters.commented) {

                const allComments = await pgPoolClient.query(`
                        SELECT * FROM comments;
                    `
                )

                const articleIDs = (allComments.rows || []).map(c => c.article_id)
                const intersected = intersection(articlesWhereClause.article_id?.in || [], articleIDs)

                articlesWhereClause.article_id = {
                    in: intersected
                }
            }

            if (filters.watchlisted) {
                const allWatchlistsArticles = await pgPoolClient.query(`
                        SELECT * FROM watchlists_articles;
                    `
                )

                const articleIDs = (allWatchlistsArticles.rows || []).map(c => c.article_id)
                const intersected = intersection(articlesWhereClause.article_id?.in || [], articleIDs)

                articlesWhereClause.article_id = {
                    in: intersected
                }
            }

            if (filters.bookmarked) {
                articlesWhereClause.article_bookmark = true
            }

            return articlesWhereClause
        } catch (err) {
            
            console.log('error building articles where clause')

            return {}
        }
    
} 