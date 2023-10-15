import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'
import { Article, Category, Prisma } from '@prisma/client';

export class CategoryService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getCategory (categoryId: number) {
        return await prisma.category.findFirst({
            where: {
                category_id: categoryId
            }
        })
    }
    async getCategoriesOLD() {

        return await prisma.$queryRaw`
            SELECT category_id, category_name, (
                SELECT COUNT(category_id) as categories_count FROM categories WHERE categories.category_id = categories.category_id
            ) FROM categories ORDER BY category_name;
        `
    }

    async getCategories(tagIDs: number[] | null, authorIDs: number[] | null) {
    
        if (tagIDs?.length || authorIDs?.length) {

            let articles = [] as Article[]

            if (tagIDs?.length && authorIDs?.length) {

                articles = await prisma.$queryRaw`
                    SELECT * FROM articles, 
                    JOIN articles_tags  
                    ON articles_tags.article_id = articles.article_id 
                    WHERE 
                        articles_tags.tag_id IN (${Prisma.join(tagIDs)}) 
                    AND 
                        articles.category_id IN (${Prisma.join(authorIDs)}) ;
                `

            } else if (tagIDs?.length) {
                articles = await prisma.$queryRaw`
                    SELECT * FROM articles 
                    JOIN articles_tags  
                    ON articles_tags.article_id = articles.article_id 
                    WHERE articles_tags.tag_id IN (${Prisma.join(tagIDs)});
                `
            } else if (authorIDs?.length) {

                articles = await prisma.$queryRaw`
                    SELECT * FROM articles 
                    WHERE articles.category_id IN (${Prisma.join(authorIDs)}) ;
                `
                console.log(articles)
            }
            

            const categoryIDs = articles.map(a => Number(a.category_id))

            if (!categoryIDs?.length) {
                return []
            }

            return await prisma.$queryRaw`
                SELECT categories.category_id, categories.category_name,
                    (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.category_id = categories.category_id)
                FROM categories
                WHERE  categories.category_id IN (${Prisma.join(categoryIDs)}) ;
            `
   
        }

        return await prisma.$queryRaw`
            SELECT categories.category_id, categories.category_name,
                (SELECT COUNT(article_id) as articles_count FROM articles WHERE articles.category_id = categories.category_id)
            FROM categories;
        `
    }

    async createCategory(categoryName: string, userId: number) {

        const category = await prisma.category.create({
            data: {
                category_name: categoryName,
                user_id: userId
            }
        })
    
        return category 
    }

    async getCategoryArticles (categoryId: number) {
        return await prisma.article.findMany({
            where: {
                category_id: categoryId
            }
        })
    }
}
