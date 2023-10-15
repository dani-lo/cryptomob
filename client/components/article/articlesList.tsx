import { ArticleAPiData, Article } from "@/src/models/article";
import { StyledCardContainer } from "@/src/styles/main.styled";
import { ArticleCardComponent } from "./articleCard";
import { PaginationComponent } from "../widgets/pagination";
import { useBookmarkArticle, useDeleteArticle } from "@/src/hooks/useArticles";
import { useContext } from "react";
import { ApiParamsContext } from "@/context/apiParams.context";
import { useAtom } from "jotai";
import { PaginationCtrl } from "@/src/utils/paginationCtrl";
import { CreateArticleComponent } from "./createArticle";


interface AtriclesProps { articles: ArticleAPiData[], recordsCount: number }

export const ArticlesListComponent = ({ paginatedArticles }: { paginatedArticles: AtriclesProps }) => {

    const bookmarkArticle = useBookmarkArticle()
    const deleteArticle = useDeleteArticle()

    const ctx = useContext(ApiParamsContext)
    
    // const [publicFilters, _setPublicFilters] = useAtom(ctx.filterParams.articles.pub)
    const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.articles)
    
    const paginationCtrl = new PaginationCtrl(
        paginatedArticles.recordsCount,
        fetchParams.offset,
        fetchParams.limit
      )

    return <div>
      <div className="flex items-center justify-between">
            <div style={{ flex: 1}}>  
                <CreateArticleComponent />
            </div>
            {/* <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent onSearch={ (term: string) => {
                        if (term === '') {
                            setSearchterm(term)
                        }
                }} />
            </div> */}
        </div>
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
          />
        })
    }
    </StyledCardContainer>
    <PaginationComponent 
      paginationCtrl={ paginationCtrl } 
      onSelectPage={ (nextOffset) => { 
        // observableFetchParams.setParams({ offset: nextOffset })
        setFetchParams({ ...fetchParams, offset: nextOffset })
      }} 
    /> 
    </div>
}