import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { AuthorsScreenComponent } from '@/components/author/authorsScreen'

const AuthorsPage = () => {

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <AuthorsScreenComponent  />
      </Suspense>
    
  </div>
}

export default AuthorsPage