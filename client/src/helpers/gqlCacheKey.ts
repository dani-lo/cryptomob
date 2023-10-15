import { fnCmp } from "./compare"

export const gqlCacheKey = (params: any[]) => {
    return params.map(p => {
        if (Array.isArray(p)) {
            return JSON.stringify(p.sort(fnCmp))
        } else if  (typeof p === 'object' && p.constructor === Object) {
            return JSON.stringify(p)
        }
        return `${ p }`

    }).join('-')
}