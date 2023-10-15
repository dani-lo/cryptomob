import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'
import { Article, Author, Prisma } from '@prisma/client';

export class AuthorService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getAuthors(tagIDs: number[] | null, categoryIDs: number[] | null) {
    
        if (tagIDs?.length || categoryIDs?.length) {

            let articles = [] as Article[]

            if (tagIDs?.length && categoryIDs?.length) {

                articles = await prisma.$queryRaw`
                    SELECT * FROM articles 
                    JOIN articles_tags  
                    ON articles_tags.article_id = articles.article_id 
                    WHERE 
                        articles_tags.tag_id IN (${Prisma.join(tagIDs)}) 
                    AND 
                        articles.category_id IN (${Prisma.join(categoryIDs)} ;
                `

            } else if (tagIDs?.length) {
                articles = await prisma.$queryRaw`
                    SELECT * FROM articles 
                    JOIN articles_tags  
                    ON articles_tags.article_id = articles.article_id 
                    WHERE articles_tags.tag_id IN (${Prisma.join(tagIDs)});
                `
            } else if (categoryIDs?.length) {
                articles = await prisma.$queryRaw`
                    SELECT * FROM articles 
                    WHERE articles.category_id IN (${Prisma.join(categoryIDs)});
                `
            }

            const authorIDs = articles.map(a => Number(a.author_id))

            return await prisma.author.findMany({
                where: {
                    author_id: {
                        in: authorIDs
                    }
                }
            })
        }

        return await prisma.author.findMany()
    }

    async getAuthor (author_id: number) {
        return prisma.author.findFirst({
            where: {
                author_id
            }
        })  
    }
}