import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { Article, Category, Prisma } from '@prisma/client';
import { WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers';
import { hasAnyFilter } from '../../helpers/has';
import { getPool } from '../../db/pgPool';
// import { QueryResult } from 'pg';
import { whereArrayInValues } from '../../helpers/where';

export class CategoryService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async pgGetCategory (categoryId: number) {
        
        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM categories WHERE category_id = $1;', [categoryId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching category' + categoryId)

        } finally {
            pgclient.release()
        }
    }

    async pgGetCategories(
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
                    pgclient
                )
                const strArticlesWhere = whereClauseObjToSql(articlesWhere, 'articles')
                
                const articles = await pgclient.query(`
                        SELECT * FROM articles  ${ strArticlesWhere?.length ? ' WHERE ' + strArticlesWhere : '' };
                    `
                )

                const categoryIDs = articles.rows.map(a => Number(a.category_id)) 

                if (!categoryIDs?.length) {
                    return []
                }

                return pgclient.query(`
                        SELECT categories.category_id, categories.category_name,
                            (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.category_id = categories.category_id)
                        FROM categories
                        WHERE category_id IN ${ whereArrayInValues(categoryIDs) };
                    `
                )
            }

            return pgclient.query(`
                SELECT categories.category_id, categories.category_name,
                    (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.category_id = categories.category_id)
                FROM categories;
            `)
            
        } catch (error) {
            console.log(error)
            return Promise.reject('Error fetching articles')
        } finally {
            pgclient.release()
        }
        
    }

    async pgcCreateCategory(categoryName: string, userId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query('INSERT INTO categories (category_name, user_id) VALUES ($1, $2) RETURNING *', [categoryName, userId])

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating tag')
        } finally {
            pgclient.release()
        }
    }

    async pgGetCategoryArticles (categoryId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM articles WHERE category_id = $1;', [categoryId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching category' + categoryId)

        } finally {
            pgclient.release()
        }
    }
}
