import { QueryClient } from "@tanstack/react-query"
import { GqlCacheKeys } from "../queries"
import { TagApiData } from "../models/tag"
import { AuthorApiData } from "../models/author"

export const updateClientTagsCache = (
    client: QueryClient,
    replaceItem: TagApiData, 
) => {

    const cacheQueryKey = {
        queryKey: [GqlCacheKeys.tags],
        exact: false
    }

    // @ts-ignore
    const cachedTags = client.getQueryData(cacheQueryKey) as unknown as { tags: TagApiData[] }
    const newCachedTags = [...cachedTags.tags]

    const idx = cachedTags.tags.findIndex((a: TagApiData) => a.tag_id === replaceItem.tag_id)
    
    newCachedTags[idx] = replaceItem
    
    client.setQueriesData(cacheQueryKey, { tags: newCachedTags })

}

export const updateClientAuthorsCache = (
    client: QueryClient,
    replaceItem: AuthorApiData, 
) => {

    const cacheQueryKey = {
        queryKey: [GqlCacheKeys.authors],
        exact: false
    }

    // @ts-ignore
    const cachedAuthors = client.getQueryData(cacheQueryKey) as unknown as { authors: AuthorApiData[] }
    const newCachedAuthors = [...cachedAuthors.authors]

    const idx = cachedAuthors.authors.findIndex((a: AuthorApiData) => a.author_id === replaceItem.author_id)
    
    newCachedAuthors[idx] = replaceItem
    
    client.setQueriesData(cacheQueryKey, { authors: newCachedAuthors })

}