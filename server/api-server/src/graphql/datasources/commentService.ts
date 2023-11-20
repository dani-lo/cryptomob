import { DataSource } from 'apollo-datasource'

// import prisma from '../../db/prisma'
import { getPool } from '../../db/pgPool';

export class CommentService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    // async getComments () {
        
    //     return await prisma.comment.findMany()
    // }

    async pgGetComments (appId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
            return pgclient.query(`
                SELECT * FROM comments
                JOIN articles ON articles.article_id = comments.article_id
                WHERE articles.app_id = ${ appId };
            `)
        } catch (err) {
        
            console.log(err)
        
            return Promise.reject('Error fetching comments')
        
        } finally {
            pgclient.release()
        }

    }

    // async createComment(text: string, articleId: number, userId: number) {

    //     const comment = await prisma.comment.create({
    //         data: {
    //             comment_text: text,
    //             article_id: articleId,
    //             user_id: userId
    //         }
    //     })

    //     return comment 
    // }

    async pgCreateComment(text: string, articleId: number, userId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {

            return pgclient.query('INSERT INTO comments (comment_text, article_id, user_id) VALUES ($1, $2, $3) RETURNING *', [text, articleId, userId])

        } catch (error) {
            console.log(error)
            return Promise.reject('Error creating comment')
        } finally {
            pgclient.release()
        }
    }   
}