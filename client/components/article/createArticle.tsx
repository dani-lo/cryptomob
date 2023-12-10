import { useState } from "react"

import * as cnames from "@/src/styles/classnames.tailwind"
import { useAddArticle } from "@/src/hooks/useArticles"
import { useAtom } from "jotai";
import { currSettingAtom } from "@/src/store/settingAtoms";

interface ArticleInput {
    title: string; 
    description: string; 
    link: string;
}

export const CreateArticleComponent = () => {

    const [articleData, setArticleData] = useState<ArticleInput>({ title: '', description: '', link: ''})

    const addCategoryMutation =  useAddArticle()

    const [settings] = useAtom(currSettingAtom)

    const onSubmit = () => {
        
        addCategoryMutation.mutate({
                article_title: articleData.title,
                article_description: articleData.description,
                article_link: articleData.link,
                app_id: settings.appId || 0
        })

        setArticleData({ title: '', description: '', link: ''})
    }

    const disabled = Object.values(articleData).some(s => !s || s.length === 0)

    return <div className="flex items-center" style={{ overflowY: 'scroll' }}>
        <div className="flex" style={{  padding: '1rem 1rem 1rem 0', alignItems: 'flex-end' }}>
            <div style={{ display: 'inline-block', padding: '0 0.5rem 0 0' }}>
                <label className={ cnames.cnPostscriptum }>Title</label>
                <input
                    name="postContent"
                    value={ articleData.title }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, title: e.target.value }) }
                />
            </div>
            <div style={{ display: 'inline-block', padding: '0 0.5rem 0 0' }}>
                <label className={ cnames.cnPostscriptum }>Description</label>
                <input
                    name="postContent"
                    value={ articleData.description }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, description: e.target.value }) }
                />
            </div>
            <div style={{ display: 'inline-block', padding: '0 0.5rem 0 0' }}>
                <label className={ cnames.cnPostscriptum }>Link</label>
                <input
                    name="postContent"
                    value={ articleData.link }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, link: e.target.value }) }
                />
            </div>
            <div style={{ display: 'inline-block', padding: '0 0.5rem 0 0' }}>
                <button 
                    className={ disabled ? cnames.utils.disabled(cnames.cnButton) :  cnames.cnButton }
                    onClick={ onSubmit }
                >
                    Add article
                </button>
            </div>
            
        </div>
        
    </div>
}