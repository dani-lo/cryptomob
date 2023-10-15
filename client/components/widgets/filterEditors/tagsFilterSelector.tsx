import { useContext, useState } from "react"

import { useTagsWithArticlesCount } from "@/src/hooks/useTags"

import { CheckListComponent } from "@/components/widgets/selectablesList"

import { ApiParamsContext } from "@/context/apiParams.context"
import { useAtom } from "jotai"

export const TagsFilterSelectorComponent = () => {

    const [limitopts] = useState(false)

    const ctx = useContext(ApiParamsContext)
    
    const [protectedFilters, setProtectedFilters] = useAtom(ctx?.filterParams?.articles.protect)
    const [publicFilters] = useAtom(ctx?.filterParams?.articles.pub)

    const {
        data: rawData
    } = useTagsWithArticlesCount(publicFilters)

    const data = rawData || { tags: []}

    const tagsOptions = data.tags.map(t => {

        return {
            label:t.tag_name,
            value: Number(t.tag_id),
            payoff: `found in ${ t.articles_count } articles`
        }
    }).filter(t => {
        if (!limitopts) {
            return true
        }
        return protectedFilters.tags.includes(t.value)
    })

    const selected = protectedFilters.tags ? [...protectedFilters.tags] : []

    return <div>
        <CheckListComponent 
            selected={ selected }
            items={ tagsOptions }
            onSelect={ (val: number, selected: boolean) => {

                const newTags = protectedFilters.tags ? [...protectedFilters.tags] : []

                if (selected) {
                    
                    if (!newTags.includes(val)) {
                        newTags.push(val)

                        setProtectedFilters({ ...protectedFilters, tags : newTags })
                    }
                    
                } else {
                    setProtectedFilters({ ...protectedFilters, tags: newTags.filter(v => v !== val) })
                }
                
            }}
        />
    </div>
}