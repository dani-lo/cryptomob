// import { ellipsys } from '@/src/helpers/ellipsys';
// import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';
// import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
// import { useState } from 'react';
// import { CommentApiData } from '@/src/models/comment';
// // import { CreateCommentComponent } from './createComment';
// import { ResourceItemsCount } from '@/src/queries';
// import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
// import { SortIconComponent } from '../widgets/sortIcon';
// import { getAppStaticSettings } from '@/src/store/settingAtoms';
 
// type CommentProps = CommentApiData & ResourceItemsCount

// export const CommentsListComponent = ({ comments}: { comments: CommentProps[]}) => {

//     const [searchterm, setSearchterm] = useState('')
//     const [sortby, setSortby] = useState<[keyof CommentProps, SortDirection | null]>(['comment_text', null])

//     const onSortBy = (newSortField : keyof CommentProps) => {

//         const currSortDir = sortby[1]
//         const currSortField = sortby[0]

//         const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
//         setSortby([newSortField , sortDir])
//     }

//     const sorted = sortItemsArray<CommentProps>(comments, sortby[0], sortby[1])

//     const appStaticSettings = getAppStaticSettings()
//     const cnTableFull = cnTable(appStaticSettings.bg)

//     return <div>
//         <div className="flex items-center justify-between">
//             <div style={{ flex: 1, padding: '1rem' }}>
//                 <InlineSearchComponent 
//                     onSearch={ (term: string) => {
//                         // if (term === '') {
//                             setSearchterm(term)
//                         // }
//                     }} 
//                 />
//             </div>
//             {/* <div style={{ flex: 1 }}>
//                 <CreateCommentComponent onClose={ () => void 0 } />
//             </div> */}
//         </div>
//         <table className={ cnTableFull.table }>
//             <thead className={ cnTableFull.thead}>
//                 <tr>
//                     <th scope="col" className={ cnTableFull.th }onClick={ () => {
//                             onSortBy('comment_text')
//                     }}>
//                         <div className={ cnTableFull.thContent}>
//                             Comment name
//                                 { sortby[0] === 'comment_text' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
//                          </div>
//                     </th>
//                     <th scope="col" className={ cnTableFull.th }onClick={ () => {
//                             onSortBy('articles_count')
//                     }}>
//                         <div className={ cnTableFull.thContent}>
//                                 Count in Articles
//                                 { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
//                         </div>
//                     </th>
//                     <th scope="col" className={ cnTableFull.th }>
//                         <span className="sr-only" />
//                     </th>
//                 </tr>
//             </thead>
//             <tbody>
//             {
//                 sorted.map(t => {

//                     if (searchterm !== '' && t.comment_text.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
//                         return null
//                     }

//                     return <tr key={ t.comment_id }>
//                         <td className={ cnTableFull.td }>     
                    
//                             <span className={ cnBold }>
//                             {
//                                 ellipsys(t.comment_text, 20)
//                             }        
//                             </span>      
//                         </td>
//                         <td className={ cnTableFull.td }>
//                             {
//                                 `${t.articles_count } articles`
//                             }
//                         </td>
//                         <td className={ cnTableFull.td }>
//                             <a href="#">edit</a>
//                         </td>
//                     </tr>
//                 })
//             }
//             </tbody>
//         </table>
//     </div>
// }