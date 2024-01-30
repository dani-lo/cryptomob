import { useState, useEffect } from "react"

const packValue = (val: any): string => {


    if (typeof val === 'string') {

        return val
    } 
    if (typeof val === 'boolean') {

        return String(val)
    }

    if (val === null) {
        return ''
    }

    return JSON.stringify(val)
}   

const unpackValue = (val: string) => {

    if (!isNaN(parseInt(val, 10))) {
        return parseInt(val, 10)
    } 
    if (!isNaN(parseFloat(val))) {
        return parseFloat(val)
    } 

    // if (typeof val === 'string' && !['true', 'false'].includes(val)) {
    //     return val
    // }
    
    try {
        return JSON.parse(val)
    } catch (e) {
        return val
    }

}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {

    const storageObject = window.localStorage

    const [value, setValue] = useState<T>(() => {
        
        const val = storageObject.getItem(key)

        if (typeof val === 'string') {
            console.log('UNPACK::::', val)
            return unpackValue(val)
        }

        if (val !== null) return val
        
        return defaultValue
    })

    useEffect(() => {
        
        if (!value) {
            return storageObject.removeItem(key)
        }

        const packed = packValue(value)

        storageObject.setItem(key, packed)

    }, [key, value, storageObject])

    return [value, setValue]
}