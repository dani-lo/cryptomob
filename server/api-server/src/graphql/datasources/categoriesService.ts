import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
// import { Article, Category, Prisma } from '@prisma/client';
import { ArticleWhere, WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers';
import { hasAnyFilter } from '../../helpers/has';
import { getPool } from '../../db/pgPool';
// import { QueryResult } from 'pg';
import { whereArrayInValues } from '../../helpers/where';
import { error } from 'console';

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

                return pgclient.query(`
                        SELECT categories.category_id, categories.category_name,
                            (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.category_id = categories.category_id AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL)) 
                        FROM categories
                        WHERE categories.app_id = ${ filters.appId };
                    `
                )
            }

            throw new Error('Must pass an app id to get categories')
            
        } catch (error) {
            console.log(error)
            return Promise.reject('Error fetching articles')
        } finally {
            pgclient.release()
        }
        
    }

    async pgCreateCategory(categoryName: string, userId: number, appId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query('INSERT INTO categories (category_name, user_id, app_id) VALUES ($1, $2, $3) RETURNING *', [categoryName, userId, appId])

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating category')
        } finally {
            pgclient.release()
        }
    }

    async pgGetCategoryArticles (categoryId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM articles WHERE category_id = $1  AND (articles.article_delete IS NOT TRUE OR articles.article_delete IS NULL);', [categoryId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching category' + categoryId)

        } finally {
            pgclient.release()
        }
    }
}
