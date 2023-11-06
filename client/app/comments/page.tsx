"use client";

import { CommentsListComponent } from '@/components/comment/commentsList'
import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind'

const CommentsPage = () => {

    const { data, isError, isLoading, isFetching } = { data: { comments: []}, isError: false, isLoading: false, isFetching: false } // useCommentsWithArticlesCount()

    if (isLoading) {
        return <LoadingComponent />
      }
    
      if (isError) {
        return <ErrorComponent />
      }
    
      if (!data || !data.comments|| data.comments.length === 0) {
        return <>
            {/* <CreateCommentComponent onClose={ () => void 0 } /> */}
            <EmptyComponent />
        </>
      }

    const opacity = isFetching ? 1 : 0

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
          <div style={{ opacity }} className={ utils.cnJoin(['status-widget']) }>
            working...
          </div> 
            <CommentsListComponent comments={ data.comments } />
        </div>
}

export default CommentsPage