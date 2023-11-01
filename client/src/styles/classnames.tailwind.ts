export const cnHeaderLinkClassNameActive = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white bg-red-600 cursor-pointer px-8 py-2.5 text-base text-xs leading-3 shadow-md rounded'
export const cnHeaderLinkClassNameUnactive = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-gray-600 border border-white bg-gray-50 cursor-pointer px-8 py-2.5 text-base text-xs leading-3 shadow-md rounded'

export const cnMobHeaderLinkClassName = 'px-4 py-3 text-gray-600 bg-gray-50 border border-gray-50 focus:outline-none focus:bg-gray-100 hover:bg-gray-100 duration-100 cursor-pointer text-xs leading-3 text-base'

export const cnButton = 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
export const cnButtonDanger = 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
export const cnButtonSuccess = 'text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
export const cnButtonWarning = 'text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'

export const cnBigIcon = 'text-xl text-gray-200'
export const cnBigIconDark = 'text-xl text-cyan-900'
export const cnBigIconActive = 'text-xl text-red-600'


export const cnPageLinkActive = 'flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 '
export const cnPageLinkUnactive = 'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
export const cnNavLinkActive = 'flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 '
export const cnNavLinkUnactive = `${ cnNavLinkActive } opacity-50`

export const cnParagraph = 'my-1 py-1 text-base text-gray-700'
export const cnPostscriptum = 'text-sm text-gray-700 text-gray-800 p-0 m-0 block'
export const cnPayoff = `${ cnParagraph } font-semibold`

export const cnLabel = 'text-sm text-gray-700'


export const cnTitle = 'mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'
export const cnLogo = 'mb-8 text-2xl text-white text-center italic'

export const cnSectionTitle= 'my-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'
export const cnSectionSubTitle= 'my-6 text-xl font-light text-gray-900 lg:mb-16 sm:text-xl dark:text-gray-200'
export const cnSectionSmallTitle= 'my-3 text-lg font-bold tracking-tight text-gray-900 dark:text-white'

export const cnCardTitle= `${ cnSectionSmallTitle } my-3`

export const cnTag = 'm-2 m-y-0 ml-0 text-white bg-gray-600 cursor-pointer px-3 py-2.5 font-normal text-xs leading-3 rounded'

export const cnModal = ''

export const cnCard = ''

export const cnBaloon = 'p-4 mt-4 bg-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700'

export const cnInputText = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5'

export const cnInputSelect = ''

export const cnInputRadio = ''

export const cnInputCheckbox = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'

export const cnTabItem = 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 group'

export const cnTextClear = 'text-gray-200'

export const cnPage = "p-6"

export const cnBold = 'font-bold'

export const utils = {
    disabled: (cname: string) => `${ cname } disabled` ,
    activeText: (cname: string) => `${ cname } text-red-600` ,
    btnDanger: () => `${ cnButton } ${ cnButtonDanger }` ,
    btnWarning: () => `${ cnButton } ${ cnButtonSuccess }` ,
    btnSuccess: () => `${ cnButton } ${ cnButtonWarning }` ,
    cnJoin: (cnames: string[]) => {
        return cnames.join(' ')
    },
    cnDirectDescendant: (descendantTag: string, cname: string) => `[&>${ descendantTag }]:${ cname }`,
    cnFullW: (cname: string) => `${ cname } w-full` ,
}

export const cnTabItemSvgIcon = 'w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'

export const cnTable  = {
    table: 'w-full text-sm text-left text-gray-500 dark:text-gray-400',
    thead: 'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400',
    th: 'bg-cyan-950 px-4 py-3   text-white text-sm underline font-bold',
    thContent: 'flex items-center justify-between cursor-pointer',
    td: 'text-sm px-4 py-3 bg-gray-50 text-gray-900'
}

export const cnActionablesList = {
    div: 'my-4 max-w-md border border-solid border-gray-400 p-4 pt-2 rounded',
    ul: '',
    li: 'inline-block py-2 flex items-center justify-between',
}