import { atom } from 'jotai'
import { User } from '../models/user'
import { ToastLevel } from '@/components/widgets/modal/toast'

interface ToastData { level: ToastLevel | null, text: string, show: boolean } 

export const currUserAtom = atom<User | null>(null)
export const toastAtom = atom<ToastData>({ level: null, text: '', show: false})

export const toastWarning = (fnToast: (d: ToastData) => void, text: string) => {

    fnToast({ text, level: 'warn', show: true})

    setTimeout(() => fnToast({ text, level: null, show: false}), 3000)
}

export const toastError = (fnToast: (d: ToastData) => void, text: string) => {
    
    fnToast({ text, level: 'err', show: true})

    setTimeout(() => fnToast({ text, level: null, show: false}), 3000)
}

export const toastSuccess = (fnToast: (d: ToastData) => void, text: string) => {
    
    fnToast({ text, level: 'ok', show: true})

    setTimeout(() => fnToast({ text, level: null, show: false}), 3000)
}