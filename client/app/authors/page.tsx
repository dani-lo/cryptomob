"use client";

/*
eslint complexity: ["error", 30]
*/

import { useAtom } from 'jotai';
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateCategoryComponent } from '@/components/category/createCategory'
import { AuthorsListComponent } from '@/components/author/authorsLit'

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useAuthorsWithArticlesCount } from '@/src/hooks/useAuthors'
import { useUsers } from '@/src/hooks/useUsers'

// import { AuthorApiData } from '@/src/models/author'

import { currUserAtom } from '@/src/store/userAtoms'
import { AuthorDetailModalComponent } from '@/components/widgets/modal/authorDetail';
 

const AuthorsPage = () => {

  const { data: udata } = useUsers()

  const [user, setUser] = useAtom(currUserAtom)
//   const [activeAuthor, setActiveAuthor] = useState<(AuthorApiData  & { articles_count: number; }) | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const authorId = searchParams.get('authorId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])
  
  const { data, isError, isLoading } = useAuthorsWithArticlesCount()

  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return <ErrorComponent />
  }

  if (!data || !data.authors || data.authors.length === 0) {
    return <>
        <CreateCategoryComponent  />
        <EmptyComponent />
    </>
  }

  const reqAuthor = authorId !== null ? (data.authors.find(apiT => Number(apiT.author_id) === Number(authorId)) || null) : null

//   if (
//         activeAuthor && 
//         reqAuthor  &&  
//         (
//             Number(activeAuthor.author_id) !== Number(reqAuthor.author_id) || 
//             reqAuthor.watchlists?.length !== activeAuthor.watchlists?.length)
//         ) {

//     setActiveAuthor(reqAuthor)
      
//   } else if (!activeAuthor &&  reqAuthor) {

//     setActiveAuthor(reqAuthor)
      
//   } else if (!reqAuthor) {
//     setActiveAuthor(null)
//   }

  

  return <div  className={ utils.cnJoin([cnPage, 'content']) }>
  {
    reqAuthor ? 
      <AuthorDetailModalComponent 
          userId={ 1 }
          author={ reqAuthor } 
          onClose={ () => {
              // setTimeout(() => setActiveTag(null), 50)
              router.replace('/authors')
          }} 
      /> 
      : null
  }
  <AuthorsListComponent authors={ data.authors } />
  </div>
}

export default AuthorsPage