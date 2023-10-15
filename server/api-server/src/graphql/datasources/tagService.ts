import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'
import { Prisma, Tag } from '@prisma/client';

export class TagService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getTags(authorIDs: number[] | null, categoryIDs: number[] | null) : Promise<(Tag & { articles_count: number })[]> {

        if (authorIDs?.length || categoryIDs?.length) {

            let where : { author_id ?: { in: number[]}, category_id ?:  { in: number[]} } = {}

            if (authorIDs) {
                where['author_id'] = {
                    in: authorIDs
                }
            } 
            if (categoryIDs?.length) {
                where['category_id'] = {
                    in: categoryIDs
                }
            }

            const articles = await prisma.article.findMany({
                where
            })

            const articlesIDs = articles.map(a => Number(a.article_id))

            return await prisma.$queryRaw`
                SELECT DISTINCT tags.tag_id, tags.tag_name, tags.tag_origin,  (
                    SELECT COUNT(article_id) as articles_count FROM articles_tags 
                        WHERE articles_tags.tag_id = tags.tag_id
                )
                FROM tags 
                JOIN articles_tags ON articles_tags.tag_id = tags.tag_id  WHERE articles_tags.article_id IN (${Prisma.join(articlesIDs)})
                ORDER BY tag_id;
            `
        }

        return await prisma.$queryRaw`
            SELECT DISTINCT tag_id, tag_name, tag_origin,  (
                SELECT COUNT(article_id) as articles_count FROM articles_tags WHERE articles_tags.tag_id = tags.tag_id
            ) FROM tags ORDER BY tag_id;
        `
    }

    async createTag(tagName: string, tagOrigin: string) {
        
        const tag = await prisma.tag.create({
            data: {
                tag_name: tagName,
                tag_origin: tagOrigin
            }
        })

        return tag
    }

    async getTagCategory (categoryId: number) {
        return prisma.tag.findFirst({
            where : {
                category_id: categoryId
            }
        })
    }
}