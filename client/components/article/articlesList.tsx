import { ArticleAPiData, Article } from "@/src/models/article";
import { StyledCardContainer } from "@/src/styles/main.styled";
import { ArticleCardComponent } from "./articleCard";
import { PaginationComponent } from "../widgets/pagination";
import { useBookmarkArticle, useDeleteArticle } from "@/src/hooks/useArticles";
import { useContext, useEffect, useState } from "react";
import { ApiParamsContext } from "@/context/apiParams.context";
import { useAtom } from "jotai";
import { PaginationCtrl } from "@/src/utils/paginationCtrl";
import { CreateArticleComponent } from "./createArticle";

// import { useEffect } from "react";


interface AtriclesProps { articles: ArticleAPiData[], recordsCount: number }

// async function postData(url = "", data = {}) {

// const response = await fetch(url, {
//   method: "POST", // *GET, POST, PUT, DELETE, etc.
//   mode: "cors", // no-cors, *cors, same-origin
//   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//   credentials: "same-origin", // include, *same-origin, omit
//   headers: {
//     "Content-Type": "application/json",
//     // 'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   redirect: "follow", // manual, *follow, error
//   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//   body: JSON.stringify(data), // body data type must match "Content-Type" header
// })

// return response.json(); // parses JSON response into native JavaScript objects
// }

// export const ArticlesListComponent = () => {

//   useEffect(() => {
//     postData("http://localhost:8000/datestpost", { answer: 42 }).then((data) => {
//       console.log(data); // JSON data parsed by `data.json()` call
//     })
//   }, [])
  
//   return <p>sdf sdf dsf dsf ds fdsfds fdsfsdfdsf</p>
// }


export const ArticlesListComponent = ({ paginatedArticles }: { paginatedArticles: AtriclesProps }) => {

    const bookmarkArticle = useBookmarkArticle()
    const deleteArticle = useDeleteArticle()

    const [paginator, setPaginator] = useState<PaginationCtrl | null>(null)

    const ctx = useContext(ApiParamsContext)
    
    const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.articles)

    // console.log('_____________________ BEFORE OUTSIDE ----  EFFECT ==================== ALL 3 DEPS :::::::::::::::')
    //   console.log(paginatedArticles.recordsCount,
    //     fetchParams.offset,
    //     fetchParams.limit
    //     )
    
    useEffect(() => {

      console.log('_____________________ IN EFFECT ==================== ALL 3 DEPS :::::::::::::::')
      console.log(paginatedArticles.recordsCount,
        fetchParams.offset,
        fetchParams.limit
        )

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
    {
      paginator ? 
        <PaginationComponent 
        paginationCtrl={ paginator } 
        onSelectPage={ (nextOffset) => { 
          // observableFetchParams.setParams({ offset: nextOffset })
          setFetchParams({ ...fetchParams, offset: nextOffset })
        }} 
      /> 
      : null
    }
   
    </div>
  }