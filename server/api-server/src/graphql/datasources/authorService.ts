import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { Article, Author, Prisma } from '@prisma/client';
import { WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers';
import { getPool } from '../../db/pgPool';
import { hasAnyFilter } from '../../helpers/has';
// import { QueryResult } from 'pg';
import { whereArrayInValues } from '../../helpers/where';

export class AuthorService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetAuthors(
            fromDate: string,
            toDate: string,
            filters:WhereParameters) {
        

        const pgPool = getPool()
        const pgclient = await pgPool.connect()
                
        try {

            if (hasAnyFilter(filters)) {
                
                const articlesWhere = await articleWhere(
                    filters, 
                    fromDate, 
                    toDate,
                    pgclient,
                    {})
                const strArticlesWhere = whereClauseObjToSql(articlesWhere, 'articles')

                const articles = await pgclient.query(`
                        SELECT * FROM articles  ${ strArticlesWhere?.length ? ('WHERE' + strArticlesWhere) : '' };
                    `
                )
    
                const authorIDs = articles.rows.map((a: any) => Number(a.author_id))
                
                if (!authorIDs?.length) {
                    return {
                        rows: []
                    }
                }

                return pgclient.query(`
                        SELECT *,
                            (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.author_id = authors.author_id)
                        FROM authors
                        WHERE author_id IN ${ whereArrayInValues(authorIDs) };
                    `
                )

            } else {
                return pgclient.query(`
                        SELECT *,
                        (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.author_id = authors.author_id)
                        FROM authors;
                    `
                )
            }

        } catch (err) {
        
        //    console.log(err)

           return Promise.reject('Error fetching authors')

       } finally {
           pgclient.release()
       }
       

        
    }

    // async getAuthor (author_id: number) {
    //     return prisma.author.findFirst({
    //         where: {
    //             author_id
    //         }
    //     })  
    // }

    async pgGetAuthor (authorId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM authors WHERE author_id = $1;', [authorId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching author' + authorId)

        } finally {
            pgclient.release()
        }
        
    }

    async pgGetAuthorWatchlists (authorId: number) {

        // return {
        //     rows: []
        // }
        const pgPool = getPool()
        const pgclient = await pgPool.connect()
    
        //     console.log(`
    //     SELECT * FROM watchlists 
    //     LEFT JOIN watchlists_authors ON watchlists_authors.author_id = ${ authorId };
    // `)

        try {
             return pgclient.query(`
             SELECT * FROM watchlists 
             RIGHT JOIN watchlists_authors ON watchlists_authors.watchlist_id = watchlists.watchlist_id  
             WHERE watchlists_authors.author_id = ${ authorId };
            `)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching author' + authorId)

        } finally {
            pgclient.release()
        }
    }

    async pgDeleteAuthorWatchlist(authorId: number, watchlistId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {   
            return pgclient.query(`
                DELETE FROM watchlists_authors
                WHERE author_id = ${ authorId } AND watchlist_id = ${ watchlistId };
            `
        ) 

        } catch (error) {
            console.log(error)
            return Promise.reject('Error deleting watchlist tag')
        } finally {
            pgclient.release()
        }
    }

    async pgGetAuthorsALL () {
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`SELECT * FROM authors;`)
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching tag articles')

        } finally {
            pgclient.release()
        }
    }
}