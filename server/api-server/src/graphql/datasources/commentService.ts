import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'

export class CommentService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getComments () {
        return await prisma.comment.findMany()
    }

    async createComment(text: string, articleId: number, userId: number) {

        const comment = await prisma.comment.create({
            data: {
                comment_text: text,
                article_id: articleId,
                user_id: userId
            }
        })

        return comment 
    }


}
