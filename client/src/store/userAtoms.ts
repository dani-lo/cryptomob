import { atom } from 'jotai'
import { User } from '../models/user'

export const currUserAtom = atom<User | null>(null)
