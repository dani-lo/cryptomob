import { useContext, useEffect, useState } from "react";
import { ApiParamsContext } from "@/context/apiParams.context";
import { useAtom } from "jotai";

import { ArticleAPiData, Article } from "@/src/models/article"

import { StyledCardContainer } from "@/src/styles/main.styled"

import { useBookmarkArticle, useDeleteArticle } from "@/src/hooks/useArticles"

import { PaginationCtrl } from "@/src/utils/paginationCtrl"

import { ArticleCardComponent } from "@/components/article/articleCard"
import { PaginationComponent } from "@/components/widgets/pagination"
import { useTag } from "@/src/hooks/useTags";
import { TagDetailModalComponent } from "../widgets/modal/tagDetail";
// import { CreateArticleComponent } from "@/components/article/createArticle"

interface AtriclesProps { articles: ArticleAPiData[], recordsCount: number }

export const ArticlesListComponent = ({ paginatedArticles }: { paginatedArticles: AtriclesProps }) => {

    const [tagId, setTagId] = useState(0)

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

    console.log(tagData)

    return <div>
      <TagDetailModalComponent 
        tag={ tagData?.tag } 
        onClose={ () => setTagId(0)} userId={ 0 } 
      />
      <StyledCardContainer className="pb-8 pt-8">
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
            />
          })
      }
      </StyledCardContainer>
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