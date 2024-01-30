import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { Article, Author, Prisma } from '@prisma/client';
import { ArticleWhere, WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers';
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
            filters:WhereParameters,
            takeAll: boolean) {
        

        const pgPool = getPool()
        const pgclient = await pgPool.connect()
                
        try {

            if (hasAnyFilter(filters) && !takeAll) {
                
                return pgclient.query(`
                    SELECT DISTINCT authors.author_id, authors.author_name, 
                        (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.author_id = authors.author_id) 
                    FROM authors 
                    JOIN articles ON articles.author_id = authors.author_id 
                    WHERE articles.app_id =  ${ filters.appId };
                    `
                )

            } else if (takeAll) {
                return pgclient.query(`
                    SELECT DISTINCT authors.author_id, authors.author_name FROM authors;
                `
                )
            } else {

                throw new Error('Must pass an app id to get authors')
            }

        } catch (err) {
        
           console.log(err)

           return Promise.reject('Error fetching authors')

       } finally {
           pgclient.release()
       }
       

        
    }

    async pgcCreateAuthor(authorName: string) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query(`
                    INSERT INTO authors (author_name) VALUES ($1) RETURNING *
                `, 
                [
                    authorName
                ]
            )

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating author')
        } finally {
            pgclient.release()
        }
    }

    async pgGetPaginatedAuthors  (
        fromDate: string,
        toDate: string,
        offset: number,
        limit: number,
        filters:WhereParameters
    ) { 
    
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        if (!filters.appId) {
            throw new Error('Must pass an app id to get authors')
        }

        try {
            
                // `
                // SELECT DISTINCT authors.author_id, authors.author_name, 10 as articles_count
                // FROM authors 
                // JOIN articles ON articles.author_id = authors.author_id 
                // WHERE articles.app_id =  ${ filters.appId } 
                // ORDER BY authors.author_id
                // LIMIT ${ limit }
                // OFFSET ${ offset };
                // `
            
            const authors = await pgPool.query(`
                SELECT DISTINCT authors.author_id, authors.author_name, 10 as articles_count
                FROM authors 
                JOIN articles ON articles.author_id = authors.author_id 
                WHERE articles.app_id =  ${ filters.appId } 
                ORDER BY authors.author_id;
                `
            )

            
            
            const authorsCount = await pgclient.query(`
                SELECT COUNT(DISTINCT authors.author_id) as authorscount 
                FROM authors
                JOIN articles ON articles.author_id = authors.author_id 
                WHERE articles.app_id =  ${ filters.appId };
            `)
            
            return  Promise.resolve({
                authors: authors.rows, 
                authorsCount: authorsCount.rows[0].authorscount
            })
        

        } catch (error) {
            console.log(error)
            return Promise.reject('Error fetching authors')
        } finally {
            pgclient.release()
        }
    }

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

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

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