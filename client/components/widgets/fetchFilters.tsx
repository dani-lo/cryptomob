import { useContext, useState } from "react"

import { InfoSource } from "@/src/models/sources"
import { TabbedHeader } from "./tabbed"

import {
    faTags,
    faUserTie,
    faClone,
  } from "@fortawesome/free-solid-svg-icons"


import { TagsFilterSelectorComponent } from "./filterEditors/tagsFilterSelector"
import { ModelType } from "@/src/models"
import { ApiParamsContext } from "@/context/apiParams.context"
import { AuthorFilterSelectorComponent } from "./filterEditors/authorsFilterSelector"
import { CategoryFilterSelectorComponent } from "./filterEditors/categoryFilterSelector"
import { cnButton, utils } from "@/src/styles/classnames.tailwind"
import { useAtom } from "jotai"
import { QueryFilterParamsMinItems } from "@/src/store/app"
import { CheckboxInputComponent } from "./inputs"
import { GqlCacheKeys } from "@/src/queries"
import { useQueryClient } from "@tanstack/react-query"

// const numOptions = [0, 1,2,3,4,5,10,15,20].map(n => ({ label: `${ n }`, value: `${ n }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`}))

export const ArticlesFetchFiltersComponent = () => {

    const client = useQueryClient()

    const [activetab, setActivetab] = useState(ModelType.Tag)

    const ctx = useContext(ApiParamsContext)
    
    const [protectedFilters, setProtectedFilters] = useAtom(ctx?.filterParams?.articles.protect)
    const [publicFilters, setPublicFilters] = useAtom(ctx?.filterParams?.articles.pub)

    const hasChanges = JSON.stringify(protectedFilters) !== JSON.stringify(publicFilters)

    return <div style={{ padding: '0 2rem 2rem', margin: '0', background: '#083344' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#083344', padding: '0 2rem 2rem', margin: '0', height: '500px' }}>
            <div style={{ flex: 1, background: 'white', padding: '1rem', margin: '1rem', maxWidth: '500px'  }}>
                <TabbedHeader 
                    tabitems={[
                        {
                            icon: faTags,
                            forInfoSource: InfoSource.Article,
                            forModel: ModelType.Tag,
                            title: 'tags',
                        },
                        {
                            icon: faUserTie,
                            forInfoSource: InfoSource.Article,
                            forModel: ModelType.Author,
                            title: 'author'
                        },
                        {
                            icon: faClone,
                            forInfoSource: InfoSource.Article,
                            forModel: ModelType.Category,
                            title: 'category'
                        }
                    ]}
                    onTabSelect={ (tabId: ModelType) => setActivetab(tabId) }
                    activeTab={ activetab }
                    infoSource={ InfoSource.Article }
                />
                {
                    activetab === ModelType.Tag ?
                        <TagsFilterSelectorComponent />:
                        null
                }
                {

                    activetab === ModelType.Author ?
                        <AuthorFilterSelectorComponent />:
                        null
                }
                {

                    activetab === ModelType.Category ?
                        <CategoryFilterSelectorComponent />:
                        null
                }
                
            </div>
            
            <FetchMinFiltersComponent 
                vals={ protectedFilters.minItems }
                onChange={ (k, v) => {

                    const newMinItems = { ...protectedFilters.minItems, [k]: v }

                    setProtectedFilters({ ...protectedFilters, minItems : newMinItems })
                }}
            />
            {/* <FetchFiltersEntitiesResumeComponent /> */}
    
        </div>
        
        <div style={{ padding: '1rem', margin: '-1rem 3em 0', textAlign: 'right',  background: 'white'  }}>
            <button 
                    className={ utils.cnJoin([cnButton, hasChanges ? '' : 'disabled']) } 
                    onClick={ () => {
                        setProtectedFilters({ ...publicFilters })
                    }}
                >
                    revert changes
            </button>
            <button 
                className={ utils.cnJoin([cnButton,  hasChanges ? '' : 'disabled']) }
                onClick={() => {
                                        
                    setPublicFilters({ ...protectedFilters })

                    client.invalidateQueries([GqlCacheKeys.paginatedArticles, GqlCacheKeys.tags, GqlCacheKeys.authors])
                }}>
                    publish changes
            </button>
        </div>
        
    </div>
}

export const FetchMinFiltersComponent = ({
    vals,
    onChange
    }: {
        vals: QueryFilterParamsMinItems,
        onChange: (k: keyof QueryFilterParamsMinItems, val: boolean) => void
    }) => {


    return <div style={{ display: 'flex', background: 'white', padding: '2rem 1rem', margin: '1rem', flex: 1 }}>
        <div className="p-2 flex flex-wrap" style={{ maxWidth: '350px' }}>
            {/* <div className="px-2"> */}
            <CheckboxInputComponent 
                checked={ !!vals.authored } 
                value="authored"
                label="Author not unknown" 
                desc="Lorem  text of the printing and typesetting i" 
                onChange={ () => {
                    onChange('authored', !vals.authored)
                }}
            />
            {/* <CheckboxInputComponent 
                checked={ !!vals.tagged } 
                value='tagged'
                label="Tagged articles" 
                desc="Lorem Ipsum is rinting" 
                onChange={ () => {
                    onChange('tagged', !vals.tagged)
                }}
            /> */}
            <CheckboxInputComponent 
                checked={ !!vals.commented } 
                value='commented' 
                label="Commented articles" 
                desc="Lorem Ipsum is simply dummy text of the printing" 
                onChange={ () => {
                    onChange('commented', !vals.commented)
                }}
            />
            {/* </div>
            <div className="px-2"> */}
            <CheckboxInputComponent 
                checked={ !!vals.userTagged } 
                value='userTagged'
                label="Tags from users" 
                desc="Lorem Ipsum is simply dummy text of the printing" 
                onChange={ () => {
                    onChange('userTagged', !vals.userTagged)
                }}
            />
            <CheckboxInputComponent 
                checked={ !!vals.userAdded } 
                value='userAdded'
                label="Articles from users" 
                desc="Lorem Ipsum is simply dummy text of the printing" 
                onChange={ () => {
                    onChange('userAdded', !vals.userAdded)
                }}
            />
            <CheckboxInputComponent 
                checked={ !!vals.categoryized } 
                value='categoryized'
                label="Categorized items" 
                desc="Lorem Ipsum is simply dummy text of the printing" 
                onChange={ () => {
                    onChange('categoryized', !vals.categoryized)
                }}
            />
            <CheckboxInputComponent 
                checked={ !!vals.bookmarked } 
                value='bookmarked'
                label="Bookmarked items" 
                desc="Lorem Ipsum is simply dummy text of the printing" 
                onChange={ () => {
                    onChange('bookmarked', !vals.bookmarked)
                }}
            />
            {/* </div> */}
        </div>
        <div  className="p-4">
            
            {/* <h4 style={{ fontSize: '1rem', margin: 0,  padding:0 }}>With at least</h4>
        
            <div className="flex items-center" style={{ marginTop: '1rem' }}>
                
                <Dropdown 
                    options={ numOptions } 
                    onChange={() => {
                        void 0
                    }} 
                    value={ numOptions[0] } 
                    placeholder="Select a number" 
                />
                <span className={ utils.cnJoin([cnPostscriptum])} style={{ paddingLeft: '1rem' }}>comments</span>
            </div>
            <div className="flex items-center" style={{ marginTop: '1rem' }}>
                
                <Dropdown 
                    options={ numOptions } 
                    onChange={() => {
                        void 0
                    }} 
                    value={ numOptions[0] } 
                    placeholder="Select a number" 
                />
                <span className={ utils.cnJoin([cnPostscriptum])}  style={{ paddingLeft: '1rem' }}> tags</span>
            </div>
            <div className="flex items-center" style={{ marginTop: '1rem' }}>
                
                <Dropdown 
                    options={ numOptions } 
                    onChange={() => {
                        void 0
                    }} 
                    value={ numOptions[0] } 
                    placeholder="Select a number" 
                />
                <span className={ utils.cnJoin([cnPostscriptum])}  style={{ paddingLeft: '1rem' }}> cetegories</span>
            </div> */}
        </div>
    </div>
}

// export const FetchFiltersEntitiesResumeComponent = () => {
//     return <div className="p-4">
//         {/* <h3 className={ cnSectionSubTitle }>Selected Tags</h3> */}
//         <p className={ cnPostscriptum }>You selected <a href="#">5 tags</a></p>
//         {/* <h3 className={ cnSectionSubTitle }>Selected Categories</h3> */}
//         <p className={ cnPostscriptum }>You selected <a href="#">1 category</a></p>
//         {/* <h3 className={ cnSectionSubTitle }>Selected Authors</h3> */}
//         <p className={ cnPostscriptum }>You not selected any authors</p>
//     </div>
// }