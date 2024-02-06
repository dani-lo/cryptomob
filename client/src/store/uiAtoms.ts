import { atom } from 'jotai'

export type ThreePanelPos = 'left' | 'mid' | 'right' | 'user'

export const currPanelAtom = atom<ThreePanelPos>('mid')
