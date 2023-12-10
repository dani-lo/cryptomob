"use client"
import { useEffect, useState } from 'react'

import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnBold, cnButton, cnPage, cnParagraph, cnPostscriptum, cnSectionSmallTitle, cnTextualList, utils } from '@/src/styles/classnames.tailwind' 
import { getAppStaticSettings } from '@/src/store/static'
import { useRssSources } from '@/src/hooks/useEtl'
import { API_BASE } from '@/src/queries'
import { dateToPostgresDateString } from '@/src/helpers/date'

const EtlPage = () => {
    
    const [populating, setPopulating] = useState(false)
    const [result, setResult] = useState<any>(null)

    const appStaticSettings = getAppStaticSettings()
    const { data, isError, isLoading, isFetching } = useRssSources(appStaticSettings.appId)

    const onPopulate = async () => {
        setPopulating(true)
    }

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

    const opacity = isLoading || isFetching || populating ? 1 : 0

    // @ts-ignore
    const yesterday = new Date() - (1000 * 60 * 60 * 24 * 2)

    return <div  className={ utils.cnJoin([cnPage, 'content']) }>
        <div style={{ opacity }} className={ utils.cnJoin(['status-widget']) }>
            <p>working...</p>
        </div> 
        {
        isLoading ? null : <div>
            <p className={ utils.cnJoin([cnParagraph, 'my-6']) }>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, tation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
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
        
    </div>
}

export default EtlPage