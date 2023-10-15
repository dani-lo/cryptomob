import articleResolver from "./articleResolver"
import authorResolver from "./authorResolver"
import tagResolver from "./tagResolver"
import commentResolver from "./commentResolver"
import watchlistResolver from "./watchlistResolver"
import coinResolver from './coinResolver'
import categoryResolver from "./categoryResolver"
import userResolver from './userResolver'
import { PrismaClient } from "@prisma/client"
import { intersection } from "../../helpers/arr"

export const resolvers = {
    'article': articleResolver,
    'author':authorResolver,
    'tag': tagResolver,
    'comment': commentResolver,
    'watchlist': watchlistResolver, 
    'coin': coinResolver,
    'category': categoryResolver,
    'user': userResolver
}

export type WhereParameters = 
    {
        authors?:number[] | null,
        tags?: number[] | null,
        categories?: number[] | null,
        hashtags?: number[] | null,
        tagged ?: boolean | null;
        userTagged?: boolean | null;
        commented?: boolean | null;
        watchlisted?: boolean | null;
        categoryized?: boolean | null;
        authored?: boolean | null;
        userAdded?: boolean | null;
        bookmarked ?: boolean | null;
}

export type PaginationQueryParams = {
    offset: number;
    limit: number;
    sortBy: string;
    sortDirection: string;
    fromDate: string;
    toDate: string; 
    whereTags?: number[];
    whereAuthors?: number[];
    whereCategories?: number[];
    whereHashtag?: number[];
    tagged ?: boolean;
    userTagged?: boolean;
    commented?: boolean;
    watchlisted?: boolean;
    categoryized?: boolean;
    authored?: boolean;
    userAdded?: boolean;
}

interface ArticleWhere {
    article_id?:  { in: number[]};
    author_id?: { in: number[]}| { not: null };
    category_id?: { in: number[]} | { not: null };
    article_datepub?: {
        gte: string;
        lte: string;
    };
    article_origin?: string;
    article_bookmark?: boolean;

}

export const articleWhere = async (
        filters:WhereParameters, 
        fromDate: string, 
        toDate: string, 
        prismaClient: PrismaClient
    ) => {

    const prismaWhere : ArticleWhere = {}

    if (filters.tags?.length) {

        const articles_tags_ids = await prismaClient.articlesTags.findMany({
            where: {
                'tag_id': {
                    in: filters.tags
                }
            }

        })

        const articlesIDs = articles_tags_ids.map(d => d.article_id)
        const intersected = intersection(prismaWhere.article_id?.in || [], articlesIDs)
        

        prismaWhere.article_id = {
            in: intersected
        }
    }

    if (filters.authors?.length) {
        
        prismaWhere.author_id = {
            in: filters.authors
        }
    }

    if (filters.categories?.length) {
        
        prismaWhere.category_id = {
            in: filters.categories
        }
    }

    if (fromDate && toDate) {
        
        prismaWhere.article_datepub = {
            gte: new Date(fromDate).toISOString(),
            lte: new Date(toDate).toISOString()
        }
    }

    if (filters.userAdded === true) {
        
        prismaWhere.article_origin = 'user'
    }

    if (filters.categoryized && !filters.categories?.length) {
        prismaWhere.category_id = {
            not: null
        }
    }

    if (filters.authored && !filters.authors?.length) {
        prismaWhere.author_id = {
            not: null
        }
    }

    if (filters.tagged && !filters.tags?.length) {

        const articlesTagIds = await prismaClient.articlesTags.findMany()
        const articleIDs = articlesTagIds.map(d => d.article_id)
        const intersected = intersection(prismaWhere.article_id?.in || [], articleIDs)

        prismaWhere.article_id = {
            in: intersected
        }
    }

    if (filters.commented) {
        const allComments = await prismaClient.comment.findMany()
        const articleIDs = allComments.map(c => c.article_id)

        const intersected = intersection(prismaWhere.article_id?.in || [], articleIDs)

        prismaWhere.article_id = {
            in: intersected
        }
    }

    if (filters.watchlisted) {
        const allWatchlistsArticles = await prismaClient.watchlistsArticles.findMany()
        const articleIDs = allWatchlistsArticles.map(c => c.article_id)

        const intersected = intersection(prismaWhere.article_id?.in || [], articleIDs)

        prismaWhere.article_id = {
            in: intersected
        }
    }

    if (filters.bookmarked) {
        prismaWhere.article_bookmark = true
    }

    return prismaWhere

} 