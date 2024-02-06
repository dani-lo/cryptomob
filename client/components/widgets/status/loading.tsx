import { HeaderComponent } from '@/components/header'
import { AppStaticSettings } from '@/src/store/static'
import { cnBold, cnCardContainer, cnCardTitle, cnItemCard, cnPage, cnParagraph, cnSectionSmallTitle, cnTable, cnTag, utils } from '@/src/styles/classnames.tailwind'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   faBookmark,
//   faPalette,
//   faComment,
//   faTrash,
//   faPlus
// } from "@fortawesome/free-solid-svg-icons"
export const LoadingComponent = ({appStaticSettings}: { appStaticSettings : AppStaticSettings }) => {
    return <div style={{ position: 'absolute', zIndex: '100', width: '100%' }} >
    <p className={ utils.cnJoin([appStaticSettings.txtClear, appStaticSettings.bgEvidence, cnSectionSmallTitle, cnBold, 'text-center', 'm-5', 'p-4']) }>Loading... on initial request</p>
  </div>
}

export const GhostArticlesLoadingComponent = ({staticAppSettings}: { staticAppSettings : AppStaticSettings }) => {

  // const numArticles = 12

  return <div className="app-loading">
    {/* <div id="toolbar">
      <div className={ `mb-8 flex  justify-between p-5 shadow-lg items-center toolbar ${ staticAppSettings.bg }` } style={{ borderRadius: '0.25rem' }}>
        <div>...</div>
      </div>
    </div> */}
    <div className="loading-card-container">
    {
      [1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
        return <div 
    
          className={ cnItemCard + ' flex flex-col justify-between px-4 py-2 leading-normal bg-gray-100' }
          key={ i }
          
        >      
          {/* <div className={ cnItemCardActions } style={{ height: '40px' }}>
            <div>
                <FontAwesomeIcon
                    icon={ faPlus }
                    className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon'])}
                />
            </div>
            <div className="flex items-center">
                <FontAwesomeIcon
                    icon={ faPalette }
                    className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon'])}
                />
                <FontAwesomeIcon
                    icon={ faBookmark }
                    className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                />
                <div>
                    <FontAwesomeIcon
                        icon={ faComment }
                        className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                    />
                </div>
                <FontAwesomeIcon
                    icon={ faTrash }
                    className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                />
            </div>
          </div> */}
          <div className={ cnCardContainer}>
            <h5 className={ cnCardTitle }>
                <a>
                ...
                </a>
            </h5> 
            <p  className={ cnParagraph }>
            ...
            </p>
            <p className={ cnParagraph }>..</p>
            <p className={ cnParagraph }>
                <span className={ cnBold }>...</span>. 
                <span className={ cnBold }>...</span>
            </p>
            <p className="flex flex-wrap items-baseline m-0">
                <span 
                    className={ cnTag(staticAppSettings.bg) } 
                  >...
                </span>
                <span 
                    className={ cnTag(staticAppSettings.bg) } 
                  >...
                </span>
                <span 
                    className={ cnTag(staticAppSettings.bg) } 
                  >...
                </span>
            </p>
          </div>
          </div>
      })
    }
  </div>
  </div>
}

export const GhostTableLoadingComponent = ({staticAppSettings}: { staticAppSettings : AppStaticSettings }) => {

  const cnTableFull = cnTable(staticAppSettings.bg)

  return <div className="app-loading pt-4">
    <table className={ cnTableFull.table }>
      <thead className={ cnTableFull.thead }>
          <tr className={ cnTableFull.tr }>
              <th scope="col" className={ cnTableFull.th }>
                  <div className={ cnTableFull.thContent}>
                      ...
                  </div>
              </th>
              <th scope="col" className={ cnTableFull.th }>
                  <div className={ cnTableFull.thContent}>
                          ...
                  </div>
              </th>
              <th scope="col" className={ cnTableFull.th }>
                  <span className="sr-only" />
              </th>
          </tr>
      </thead>
      <tbody className={ cnTableFull.tbody }>
      {
          [1,2,3,4,5,6,7,8,9,10].map(t => {
              return <tr key={ t } className={ cnTableFull.tr }>
                  <td className={ cnTableFull.td }>     
            
                      <span className={ cnBold }>
                      ...
                      </span>                 
                  </td>
                  <td className={ cnTableFull.td }>
                      ...
                  </td>
                  <td className={ cnTableFull.tdAction }>
                      ...
                  </td>
              </tr>
          })
      }
      </tbody>
    </table>
  </div>
}

export const GhostArticlesLoader = ({staticAppSettings}: { staticAppSettings : AppStaticSettings }) => {
  return <div className={ utils.cnJoin([cnPage, 'content', 'suspense-content']) }>
      <HeaderComponent />
      <div className="qrated-ctn  p-5"> 
        <GhostArticlesLoadingComponent staticAppSettings={ staticAppSettings } />
      </div>
  </div>
}

export const GhostTabularLoader = ({staticAppSettings}: { staticAppSettings : AppStaticSettings }) => {
  return <div className={ utils.cnJoin([cnPage, 'content', 'suspense-content']) }>
      <HeaderComponent />
      <GhostTableLoadingComponent staticAppSettings={ staticAppSettings } />
  </div>
}