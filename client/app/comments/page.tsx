"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import {  } from '@/src/hooks/useComments';

// import { CreateCommentComponent } from '@/components/comment/createComment';
import { CommentsListComponent } from '@/components/comment/commentsList';
 

const CommentsPage = () => {

    const { data, isError, isLoading } = { data: { comments: []}, isError: false, isLoading: false} // useCommentsWithArticlesCount()

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

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
            <CommentsListComponent comments={ data.comments } />
        </div>
}

export default CommentsPage