
export interface AppStaticSettings {
    bg: string,
    txt: string,
    txtClear: string
    txtEvidence: string
    bgEvidence: string
    appId: number,
    appName: string
}

const qratedAppSettings = {
    bg: 'bg-cyan-950',
    txt: 'text-cyan-950',
    txtClear: 'text-gray-200',
    txtEvidence: 'text-amber-600',
    bgEvidence: 'bg-amber-600',
    appId: 1,
    appName: 'cryptomob'
}

const fullstackedAppSettings = {
    bg: 'bg-gray-700',
    txt: 'text-gray-700',
    txtEvidence: 'text-amber-600',
    txtClear: 'text-gray-200',
    bgEvidence: 'bg-amber-600',
    appId: 2,
    appName: 'fullstacked'
}

export const getAppStaticSettings =  () : AppStaticSettings => {
    
    const useAppId = process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID

    return Number(useAppId) === 1 ? qratedAppSettings : fullstackedAppSettings
}