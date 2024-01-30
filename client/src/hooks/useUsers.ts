import { UseQueryResult, useQuery } from '@tanstack/react-query'
import request from 'graphql-request'

import { GqlCacheKeys } from '@/src/queries'
import { READ_USERS } from '@/src/queries/userQueries'

import { UserApiData } from '@/src/models/user'
import { GRAPHQL_ENDPOINT } from '../config'


export const useUsers = () => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } : UseQueryResult<{ users: UserApiData[]}> = useQuery({

        queryKey: [GqlCacheKeys.users],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_USERS())
        },
        keepPreviousData: true,
        suspense: true
    })

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData
    }
}
