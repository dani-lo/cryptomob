"use client"
import {  useEffect, useState } from 'react'

import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnBold, cnButton, cnPostscriptum, cnSectionSmallTitle, cnTextualList, utils } from '@/src/styles/classnames.tailwind' 
import { getAppStaticSettings } from '@/src/store/static'
import { useRssSources } from '@/src/hooks/useEtl'
import { API_BASE } from '@/src/config'
import { dateToPostgresDateString } from '@/src/helpers/date'
import { CreateArticleComponent } from '@/components/article/createArticle'
// import { AuthorsApiDataResult } from '@/components/author/authorsScreen'
// import { UseQueryResult, useQuery } from '@tanstack/react-query'
// import { gqlCacheKey } from '@/src/helpers/gqlCacheKey'
// import { GqlCacheKeys } from '@/src/queries'
// import request from 'graphql-request'
// import { AuthorSortby, READ_AUTHORS, READ_PAGINATED_AUTHORS } from '@/src/queries/authorQueries'
// import { SortDirection } from '@/src/helpers/sort'
// import { ApiParamsContext } from '@/context/apiParams.context'
// import { useAtom } from 'jotai'
import { useAuthorsWithArticlesCount } from '@/src/hooks/useAuthors'
import { ThreePanel } from '@/components/widgets/threePanel'
import { HeaderComponent } from '@/components/header'
// import { ThreePanel } from '@/components/widgets/threePanel'

export const EtlScreenComponent = () => {
    
    // return <ThreePanel>
    //     <div>
    //         <h1>Lorem ipso LLLLLLLLLLLLLLL leeeeffffffffffffffffffftt</h1>
    //     </div>
    //     <div>
    //         <h1>Lorem ipso MMMMMMMMMMMMMMMMMMMMM leeeeffffffffffffffffffftt</h1>
    //     </div>
    //     <div>
    //         <h1>Lorem ipso RRRRRRRRRRRRRRRRRRRRR leeeeffffffffffffffffffftt</h1>
    //     </div>
    // </ThreePanel>

    // const ctx = useContext(ApiParamsContext)

    // const [fetchParams] = useAtom(ctx.queryParams.tags)

    const [populating, setPopulating] = useState(false)
    const [result, setResult] = useState<any>(null)

    const appStaticSettings = getAppStaticSettings()
    const { data, isError, isLoading } = useRssSources(appStaticSettings.appId)

    const onPopulate = async () => {
        setPopulating(true)
    }

    // const appId = appStaticSettings.appId

    const { 
        data: authorsData,
    } = useAuthorsWithArticlesCount(100, '', '')

    useEffect( () => {

        async function populateRss () {
        
            const response = await fetch(`${ API_BASE }/etl`, { 
                method: 'POST', 
                body: JSON.stringify({ appId: appStaticSettings.appId})
            })

            return await response.json()
        }

        if (populating) {

            const res = populateRss()

            setResult(res)
            setPopulating(false)
        }
    }, [populating, appStaticSettings.appId])

    
    if (isError) {
    return <ErrorComponent />
    }

    if (!data?.rssSources?.length) {
        return <EmptyComponent />
    }

    // const opacity = isLoading || isFetching || populating ? 1 : 0

    // @ts-ignore
    const yesterday = new Date() - (1000 * 60 * 60 * 24 * 2)

    // const vizCn = process.env.NODE_ENV

    return <ThreePanel>
        <HeaderComponent />
        {
        isLoading ? null : <div className="qrated-ctn"> 
            <CreateArticleComponent 
                authorsData={ authorsData?.authors }  
            />
            <p className={ cnBold }>Needs admin access</p>
            <button 
                   className={ populating || !populating ? utils.disabled(cnButton) :  cnButton }
                   onClick={ onPopulate }
           >Populate from sources</button>
           
           {
               result ?  <p>{ result }</p> : null
           }
            
            <ul className={ utils.cnJoin([cnTextualList.ul, 'mt-8']) }>
            {
                data.rssSources.map(source => {
                    return <li className={ cnTextualList.li } key={ source.source_id }>
                        <h5 className={ cnSectionSmallTitle }>{ source.source_url.replace('https://', '').replace('www.', '') }</h5>
                        <p className={ cnPostscriptum }>last refreshed { dateToPostgresDateString(new Date(yesterday)) }</p>
                    </li>
                })
            }
            </ul>
        </div>
        }
        <div>{ null }</div>
    </ThreePanel>
}