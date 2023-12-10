import { atom } from 'jotai'

export interface AppSettings {
    appId: number
}

export const currSettingAtom = atom<AppSettings>({
    appId: 1
})