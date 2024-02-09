import { useState } from "react"

import Select from 'react-select'

import * as cnames from "@/src/styles/classnames.tailwind"
import { useAddArticle } from "@/src/hooks/useArticles"
import { CreateAuthorComponent } from "../author/createAuthor";
import { AuthorApiData } from "@/src/models/author";
import { getAppStaticSettings } from "@/src/store/static";
import { PROD_CNAME_FLAG } from "@/src/config";

interface ArticleInput {
    title: string; 
    description: string; 
    link: string;
    authorId: number;
}

export const CreateArticleComponent = ({ authorsData }: { authorsData:  (AuthorApiData & { articles_count: number;})[] | undefined}) => {

    const [articleData, setArticleData] = useState<ArticleInput>({ 
        title: '', 
        description: '', 
        link: '',
        authorId: 0
    })

    const addArticleMutation =  useAddArticle(
        (newArticle: number) => {
        
            alert('New article added: ' + newArticle)

            setArticleData({ 
                title: '', 
                description: '', 
                link: '',
                authorId: 0
            })
        }, 
        () => {
            alert('Problem creating article: ')

            setArticleData({ 
                title: '', 
                description: '', 
                link: '',
                authorId: 0
            })
        }
    )

    if (!authorsData) {
        return null
    }

    const appStaticSettings = getAppStaticSettings()

    const unvalidArticle =  Object.values(articleData).some(s => {
        return (typeof s === 'string' && s.length === 0 ) || (typeof s === 'number' && s === 0)
    })

    const onCreateArticle = () => {

        if (!unvalidArticle) {
            
            addArticleMutation.mutate({
                article_description: articleData.description,
                article_link: articleData.link,
                article_title: articleData.title,
                app_id: Number(appStaticSettings.appId) || 0,
                author_id: Number(articleData.authorId)
            })
        }
    }

    const options = authorsData.map(a => {
        return {
            label: a.author_name,
            value: a.author_id
        }
    })
   
    return <div className={ cnames.utils.cnJoin([ 'create-articles', PROD_CNAME_FLAG]) }>
        <div style={{ width: '425px'}}>
            <h2 style={{ marginTop: 0 }}>Author</h2>
                <Select 
                    options={options}
                    onChange={ (newVal) => setArticleData({ ...articleData, authorId: newVal?.value || 0 })}
                    value={ options.find(opt =>  Number(opt.value) === Number(articleData.authorId))  || null }
                />
            <CreateAuthorComponent 
                onAddedAuthor={ (authorId: number) => {
                    setArticleData({ ...articleData, authorId: authorId }) 
                }}
            />
        </div>
        <h2 className="pt-4">Article Detail</h2>
        <div className="" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
            
            <div style={{ padding: '0 0.5rem 0.5rem 0' }}>
                <label className={ cnames.cnPostscriptum }>Title</label>
                <input
                    name="postContent"
                    value={ articleData.title }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, title: e.target.value }) }
                />
            </div>
            <div style={{ padding: '0 0.5rem 0.5rem 0' }}>
                <label className={ cnames.cnPostscriptum }>Description</label>
                <input
                    name="postContent"
                    value={ articleData.description }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, description: e.target.value }) }
                />
            </div>
            <div style={{ padding: '0 0.5rem 0.5rem 0' }}>
                <label className={ cnames.cnPostscriptum }>Link</label>
                <input
                    name="postContent"
                    value={ articleData.link }
                    className={ cnames.cnInputText }                
                    onChange={(e) =>  setArticleData({ ...articleData, link: e.target.value }) }
                />
            </div>
        </div>
        <div className="py-8">
            <button 
                className={ unvalidArticle ? cnames.utils.disabled(cnames.cnButton) :  cnames.cnButton }
                onClick={ onCreateArticle }
            >
                Add article
            </button>
        </div>
    </div>
}