import { atom } from 'jotai'

export interface AppSettings {
    appId: number | null
}

export const currSettingAtom = atom<AppSettings>({
    appId: null
})


// eslint-disable-next-line no-unused-vars
// @ts-ignore
export const getAppStaticSettings =  () => {
    
    // console.log('------------------------------- process.env.CURR_APP')
    // console.log(process.env.CURR_APP)


    return {
        bg: 'bg-cyan-950',
        txt: 'text-cyan-950',
        txtEvidence: 'text-amber-600',
        bgEvidence: 'bg-amber-600',
        appId: 1,
        appName: 'cryptomob'
    }

    // let appId = 0

    // if (process?.env?.CURR_APP)  {
    //     appId = Number(process.env.CURR_APP)
    // } else if (document && document.location.host.indexOf('cryptomob') === -1)  {
    //     appId = 1
    // } else if (document && document.location.host.indexOf('fullstacked') === -1)  {
    //     appId = 2
    // }

    // return appId === 1 ? {
    //     bg: 'bg-cyan-950',
    //     txt: 'text-cyan-950',
    //     txtEvidence: 'text-amber-600',
    //     bgEvidence: 'bg-amber-600',
    //     appId: 1,
    //     appName: 'cryptomob'
    // }: {
    //     bg: 'bg-gray-700',
    //     txt: 'text-gray-700',
    //     txtEvidence: 'text-amber-600',
    //     bgEvidence: 'bg-amber-600',
    //     appId: 2,
    //     appName: 'fullstacked'
    // }
}