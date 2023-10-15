import { atom } from 'jotai'

export interface AppSettings {
    appId: number
}

export const currSettingAtom = atom<AppSettings>({
    appId: process.env.APP_ID ? Number(process.env.APP_ID) : 1
})
