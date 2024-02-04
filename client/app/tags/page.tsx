import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { TagsScreenComponent } from '@/components/tag/tagsScreen'
import { getAppStaticSettings } from '@/src/store/static'
import { GhostTabularLoader } from '@/components/widgets/status/loading'

const TagsPage = () => {
  const appStaticSettings = getAppStaticSettings()

  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostTabularLoader staticAppSettings={ appStaticSettings } />
        }
      >
        <TagsScreenComponent  />
      </Suspense>
  </div>
}

export default TagsPage