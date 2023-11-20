import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { ArticlesScreenComponent } from '@/components/article/articlesScreen'

const ArticlesPage = () => {

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <ArticlesScreenComponent  />
      </Suspense>
  </div>
}

export default ArticlesPage