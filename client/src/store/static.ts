
export interface AppStaticSettings {
    bg: string,
    txt: string,
    txtClear: string
    txtEvidence: string
    bgEvidence: string
    appId: number,
    appName: string,
    bgUnactive: string
}

const yogabhavanaAppSettings = {
    bg: 'bg-gray-700',
    txt: 'text-gray-700',
    txtEvidence: 'text-red-600',
    txtClear: 'text-gray-200',
    bgEvidence: 'bg-red-600',
    appId: 1,
    appName: 'yogabhavana',
    bgUnactive: 'bg-gray-500'
}

const fullstackedAppSettings = {
    bg: 'bg-cyan-950',
    txt: 'text-cyan-950',
    txtClear: 'text-gray-200',
    txtEvidence: 'text-amber-600',
    bgEvidence: 'bg-amber-600',
    appId: 2,
    appName: 'fullstacked',
    bgUnactive: 'bg-gray-500'
}

export const getAppStaticSettings =  () : AppStaticSettings => {
    
    let useAppId = process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID

    if (!useAppId) {

        if (process.env.INIT_CWD?.indexOf('fullstacked') !== -1) {
            useAppId = '2'
        } else if  (process.env.INIT_CWD?.indexOf('yogabhavana') !== -1) {
            useAppId = '1'
        }
    }

    // console.log('==== getAppStaticSettings useAppId', useAppId)

    return Number(useAppId) === 1 ? yogabhavanaAppSettings : fullstackedAppSettings
}