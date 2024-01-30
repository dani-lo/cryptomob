import { useContext, useEffect, useState } from "react";
import { ApiParamsContext } from "@/context/apiParams.context";
import { useAtom } from "jotai";

import { ArticleAPiData, Article } from "@/src/models/article"

// import { StyledCardContainer } from "@/src/styles/main.styled"

import { useBookmarkArticle, useDeleteArticle } from "@/src/hooks/useArticles"

import { PaginationCtrl } from "@/src/utils/paginationCtrl"

import { ArticleCardComponent } from "@/components/article/articleCard"
import { PaginationComponent } from "@/components/widgets/pagination"
import { useTag } from "@/src/hooks/useTags";
import { TagDetailModalComponent } from "../widgets/modal/tagDetail";
import { currUserAtom } from "@/src/store/userAtoms";
// import { CreateArticleComponent } from "@/components/article/createArticle"

interface AtriclesProps { articles: ArticleAPiData[], recordsCount: number }

export const ArticlesListComponent = ({ paginatedArticles }: { paginatedArticles: AtriclesProps }) => {

    const [tagId, setTagId] = useState(0)
    const [user] = useAtom(currUserAtom)

    console.log(user)

    const {
      data: tagData
    } = useTag(tagId)

    const bookmarkArticle = useBookmarkArticle()
    const deleteArticle = useDeleteArticle()

    const [paginator, setPaginator] = useState<PaginationCtrl | null>(null)

    const ctx = useContext(ApiParamsContext)
    
    const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.articles)
    
    useEffect(() => {

      setPaginator(new PaginationCtrl(
        paginatedArticles.recordsCount,
        fetchParams.offset,
        fetchParams.limit
      ))

      return () => setPaginator(null)

    }, [
      paginatedArticles.recordsCount,
      fetchParams.offset,
      fetchParams.limit
    ])

    return <div>
      <TagDetailModalComponent 
        tag={ tagData?.tag } 
        onClose={ () => setTagId(0)} userId={ user?.user_id || 0 } 
      />
      <div className="pb-8 pt-8 StyledCardContainer">
      {
          paginatedArticles.articles.map(article => {
            if (!article) {
              return null
            }
            
            return <ArticleCardComponent 
              article={ new Article(article) } 
              key={ article.article_id }
              bookmarkArticle={ bookmarkArticle.mutate }
              deleteArticle={ deleteArticle.mutate }
              selectTag= { (d: number) => setTagId(d)}
              userId={ user?.user_id || 0 }
            />
          })
      }
      </div>
      {
        paginator ? 
          <PaginationComponent 
            paginationCtrl={ paginator } 
            onSelectPage={ (nextOffset) => { 
              setFetchParams({ ...fetchParams, offset: nextOffset })
            }} 
        /> 
        : null
      }
    </div>
  }