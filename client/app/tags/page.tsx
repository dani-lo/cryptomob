import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { TagsScreenComponent } from '@/components/tag/tagsScreen'

const TagsPage = () => {

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <TagsScreenComponent  />
      </Suspense>
  </div>
}

export default TagsPage