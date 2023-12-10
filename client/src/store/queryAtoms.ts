import { atom } from 'jotai'
import { FetchParams, QueryFilterParams } from './app'
import { ArticlesSortby } from '../queries/articleQueries'
import { SortDirection } from '../helpers/sort'
import { TagsSortby } from '../queries/tagQueries'
import { AuthorSortby } from '../queries/authorQueries'

interface KeyVal {
    key: keyof QueryFilterParams,
    val: any
}

export const protectedArticlesQueryFilterAtom = atom<QueryFilterParams>({
        tags: [],
        authors: [],
        categories: [],
        hashtags: [],
        minItems: {
            tagged: false,
            userTagged: false,
            commented: false,
            watchlisted: false,
            categoryized: false,
            authored: false,
            userAdded: false,
            bookmarked: false,
        }
})

export const publicArticlesQueryFilterAtom = atom<QueryFilterParams>({
    tags: [],
    authors: [],
    categories: [],
    hashtags: [],
    minItems: {
        tagged: false,
        userTagged: false,
        commented: false,
        watchlisted: false,
        categoryized: false,
        authored: false,
        userAdded: false,
        bookmarked: false,
    }
})

export const fetchArticlesParamsAtom = atom<FetchParams<ArticlesSortby>>({
    offset: 0,
    limit: 12,
    sortBy: ArticlesSortby.date,
    sortDir: SortDirection.desc,
    dateFrom: new Date('2000-01-01'),
    dateTo: new Date('2030-01-01'),
    whereTags: [],
    whereAuthor: [],
    whereCategories: [],
    minItems: {
        tagged: false,
        userTagged: false,
        commented: false,
        watchlisted: false,
        categoryized: false,
        authored: false,
        userAdded: false,
        bookmarked: false,
    }
})

export const fetchTagsParamsAtom = atom<FetchParams<TagsSortby>>({
    offset: 0,
    limit: 12,
    sortBy: TagsSortby.date,
    sortDir: SortDirection.desc,
    dateFrom: new Date('2000-01-01'),
    dateTo: new Date('2030-01-01')
})

export const fetchAuthorsParamsAtom = atom<FetchParams<AuthorSortby>>({
    offset: 0,
    limit: 12,
    sortBy: AuthorSortby.name,
    sortDir: SortDirection.desc,
    dateFrom: new Date('2000-01-01'),
    dateTo: new Date('2030-01-01'),
})


export const setProtectedArticlesQueryFilterAtom = atom(
    () => protectedArticlesQueryFilterAtom,
    (get: any, set: any, newKeyVal: KeyVal) => {

        const a = get(protectedArticlesQueryFilterAtom)

        set(a[newKeyVal.key], newKeyVal.val)
})

export const publishArticlesQueryFiltersAtom = atom(
    () => publicArticlesQueryFilterAtom,
    (get: any, set: any) => {

        set(publicArticlesQueryFilterAtom, { ...protectedArticlesQueryFilterAtom })
})