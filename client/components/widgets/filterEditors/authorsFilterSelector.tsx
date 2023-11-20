import { useContext, useState } from "react"

import { useAuthorsWithArticlesCount } from "@/src/hooks/useAuthors"

import { CheckListComponent } from "@/components/widgets/selectablesList"
import { ApiParamsContext } from "@/context/apiParams.context"
import { useAtom } from "jotai"
import { dateToPostgresDateString } from "@/src/helpers/date"
import { getAppStaticSettings } from "@/src/store/settingAtoms"

export const AuthorFilterSelectorComponent = () => {

    const ctx = useContext(ApiParamsContext)
    
    const [protectedFilters, setProtectedFilters] = useAtom(ctx?.filterParams?.articles.protect)
    const [publicFilters] = useAtom(ctx?.filterParams?.articles.pub)

    // const ctx = useContext(ApiParamsContext)
  
    const [fetchParams]  = useAtom(ctx.queryParams.articles)

    const dateFrom = dateToPostgresDateString(fetchParams.dateFrom)
    const dateTo = dateToPostgresDateString(fetchParams.dateTo)
    
    const appId = getAppStaticSettings().appId

    const {
        data: rawData,
    } = useAuthorsWithArticlesCount(appId, dateFrom, dateTo, publicFilters)

    const [limitopts] = useState(false)
 
    const data = rawData || { authors: [] }
    
    const authorsOptions = data.authors.map(t => {

        return {
            label:t.author_name,
            value: Number(t.author_id),
            payoff: `wrote ${ t.articles?.length } articles`
        }
    }).filter(t => {
        if (!limitopts) {
            return true
        }
        return protectedFilters.authors.includes(t.value)
    })

    const selected = protectedFilters.authors ? [...protectedFilters.authors] : []

    return <div> 
        <CheckListComponent 
            selected={ selected }
            items={ authorsOptions }
            onSelect={ (val: number, selected: boolean) => {

                const newAuthor = protectedFilters.authors ? [...protectedFilters.authors] : []

                if (selected) {
                    
                    if (!newAuthor.includes(val)) {
                        newAuthor.push(val)

                        setProtectedFilters({ ...protectedFilters, authors : newAuthor })
                    }
                    
                } else {
                    setProtectedFilters({ ...protectedFilters, authors: newAuthor.filter(v => v !== val) })
                }
                
            }}
        />  
    </div>
}