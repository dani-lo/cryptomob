import { DataSource } from 'apollo-datasource'


// import { PrismaClient } from '@prisma/client'

import prisma from '../../db/prisma'
import { off } from 'process';
import { ArticlesTags, Comment, Prisma, Tag, WatchlistsArticles } from '@prisma/client';
import { WhereParameters, articleWhere } from '../resolvers';

export class ArticleService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}


    async getTagArticles (tag_id: number) {
        return prisma.articlesTags.findMany({
            where : {
                tag_id
            }
        })
    }

   async getAuthorArticles(author_id: number) {

    return prisma.article.findMany({
            where : {
                author_id
            }
        })
    }

    async getAuthorsArticles(authorIDs: number[]) {

        return prisma.article.findMany({
                where : {
                    author_id: {
                        in: authorIDs
                    }
                }
            })
        }

    async getArticles(offset: number, sort: string, limit: number) {

        const allArticles =  await prisma.article.findMany({
            skip: offset,
            take: limit,
          })

        return allArticles
    }

    async getPaginateArticles(
        offset: number, 
        sortBy: string, 
        sortDirection: string, 
        limit: number, 
        fromDate: string,
        toDate: string,
        filters:WhereParameters) {
        
        const sortDirectionPrisma = sortDirection == 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc
        const orderByClause = sortBy == 'date' ? 
            { article_id : sortDirectionPrisma } : 
            { author: { author_name: sortDirectionPrisma } 
        }

        const whereClause = await articleWhere(filters, fromDate, toDate, prisma)

        const prismaFindMany = {
            skip: offset,
            take: limit,
            orderBy: orderByClause,
            include: { 
                tags: true
            },
            where: whereClause
        }

        const [articles, recordsCount] = await prisma.$transaction([
            prisma.article.findMany(prismaFindMany),
            prisma.article.count({ where: whereClause })
        ]);

        return {
            articles,
            recordsCount
        }
    }

    getArticle(article_id: number) {

        return prisma.article.findFirst({
            where: {
                article_id: article_id
            }
        })
    }

    async createArticle(articleTitle: string, articleDescription: string, articleLink: string, articleAPpId: number) {

        const author = await prisma.author.findFirst({
            where : {
                author_name: 'user'
            }
        })

        const articleData = {
            article_title: articleTitle,
            article_description: articleDescription,
            article_link: articleLink,
            article_datepub: new Date().toISOString(),
            article_content: '',
            article_bookmark: false,
            article_delete: false,
            article_origin: 'user',
            app_id: articleAPpId,
            author_id: author?.author_id || 146,
        }

        const created = await prisma.article.create({
            data: { ...articleData }
        })

        return created
    }

    async getArticleTags(tags: ArticlesTags[]) {

        const tagIds = tags.map(t => t.tag_id)
        const articleTags = await prisma.tag.findMany({
            where: {
                'tag_id' : {
                    in: tagIds
                } 
            }
        })

        return articleTags
    }

    async getArticleAuthor(author_id: number) {

       return await prisma.author.findFirst({
            where: {
                author_id
            }
        })
    }

    async getArticleComments(article_id: number) {

        return await prisma.comment.findMany({
            where: {
                'article_id' : article_id
            }
        })
    }

    async getArticleWatchlists (articleId: number) {

        const watchlistArticles = await prisma.watchlistsArticles.findMany({
            where: {
                article_id: articleId
            }
        })
        const watchlistsIds = watchlistArticles.map(w => w.watchlist_id)

        return await prisma.watchlist.findMany({
            where: {
                watchlist_id: {
                    in: watchlistsIds
                }
            }
        })
    }

    async addBookmarkArticle (article_id: number, val: boolean) {

        return await prisma.article.update({
            where: {
              article_id
            },
            data: {
              article_bookmark: val
            },
          })
    }

    async deleteArticle (article_id: number, val: boolean) {

        return await prisma.article.update({
            where: {
              article_id
            },
            data: {
                article_delete: val
            },
        })
    }

    async categoriseArticle (categoryId: number, articleId: number) {

        const relation = await prisma.article.update({
            where: {
                article_id: articleId
            },
            data: {
                category_id: categoryId
            }
        })

        return relation
    }

    async tagArticle (tagId: number, articleId: number) {

        const relation = await prisma.articlesTags.create({
            data: {
                tag_id: tagId,
                article_id: articleId
            }
        })

        return relation
    }

    async articleExtras (articleId: number, categoryId: number, watchlistId: number) {

        let res 

        if (categoryId && watchlistId) {
            res = await prisma.$transaction([
                prisma.article.update({
                    where: { article_id: articleId },
                    data: { category_id: categoryId }
                }),
                prisma.watchlistsArticles.create({ data : {
                    article_id: articleId,
                    watchlist_id: watchlistId
                }})
            ]);
        } else if (categoryId) {
            res = await prisma.article.update({
                where: { article_id: articleId },
                data: { category_id: categoryId }
            })
        } else if (watchlistId) {
            res = await prisma.watchlistsArticles.create({ data : {
                article_id: articleId,
                watchlist_id: watchlistId
            }})
        }

        return await prisma.article.findFirst({
            where: {
                article_id: articleId
            }
        })
    }  
}

// ----- Helper Functions -----
function newId() {
    return Math.random()
        .toString(36)
        .substring(7);
}

function findAuthor(id: number) {
    return authors.find(author => author.author_id === id);
}

function findTag(id: number) {
    return tags.find(tag => tag.tag_id === id);
}

function findArticle(id: number) {
    return articles.find(article => article.article_id === id);
}

// ----- Initial Data -----
let authors = [
    {
        author_id: 1,
        author_name: 'Erich Gamma'
    },
    {
        author_id: 2,
        author_name: 'Richard Helm'
    },
    {
        author_id: 3,
        author_name: 'Ralph Johnson'
    },
    {
        author_id: 4,
        author_name: 'John Vlissauthor_ides'
    },
    {
        author_id: 5,
        author_name: 'Martin Fowler'
    },
    {
        author_id: 6,
        author_name: 'Eric Evans'
    },
    {
        author_id:7,
        author_name: 'Robert C. Martin'
    }
];

let tags = [
    {
        tag_id: 1,
        tag_name: 'price fluctuations',
        tag_origin: 'feed'
    },
    {
        tag_id: 2,
        tag_name: 'doge and more',
        tag_origin: 'feed'
    },
    {
        tag_id: 3,
        tag_name: 'cryptoman resources',
        tag_origin: 'feed'
    },
    {
        tag_id: 4,
        tag_name: 'latest news cycle',
        tag_origin: 'feed'
    },
    {
        tag_id: 5,
        tag_name: 'markets',
        tag_origin: 'feed'
    },
    {
        tag_id: 6,
        tag_name: 'regulations',
        tag_origin: 'feed'
    },
    {
        tag_id: 7,
        tag_name: 'meme coins',
        tag_origin: 'feed'
    },
    {
        tag_id: 8,
        tag_name: 'IPOs and other news',
        tag_origin: 'feed'
    },
    {
        tag_id: 9,
        tag_name: 'blockchain',
        tag_origin: 'feed'
    },
    {
        tag_id: 10,
        tag_name: 'ethereum',
        tag_origin: 'feed'
    }
];

let articles = [
    {
        article_id:  1,
        article_title: 'Design Patterns - Elements of Reusable Object-Oriented Software',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 1
    },
    {
        article_id:2,
        article_title: 'Refactoring - Improving the Design of Existing Code',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 1
    },
    {
        article_id: 3,
        article_title: 'Patterns of Enterprise Application Architecture',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 2
    },
    {
        article_id: 4,
        article_title: 'Domain-Driven Design',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 1
    },
    {
        article_id: 5,
        article_title: 'Clean Code - A Handbook of Agile Software Craftsmanship',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 3
    },
    {
        article_id: 6,
        article_title: 'Agile Software Development, Principles, Patterns, and Practices',
        article_link: 'http://foo.com',
        article_description: '',
        article_content: '',
        article_datepub: '',
        author_id: 4
    }
];

let articlesTags = [
    {
        id: 1,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 2,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 3,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 4,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 5,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 6,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 7,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 8,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 9,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 10,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 11,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 12,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 13,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 14,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 15,
        article_id: 1,
        tag_id: 3
    },
    {
        id: 16,
        article_id: 1,
        tag_id: 3
    },
];
