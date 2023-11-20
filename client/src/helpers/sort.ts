export enum SortDirection {
    'desc' = 'desc',
    'asc' = 'asc',
}

type CustomSortAccessor <T> = (item: T) => number | string


export const sortItemsArray = <T>(
        items: T[], 
        byKey: keyof T, 
        sortDir: SortDirection | null, 
        sortF ?: CustomSortAccessor<T> | null
        // eslint-disable-next-line max-params  
    ) : T[] => {

    return [...items].sort((item_a: T, item_b: T) => {

        const a = sortF ? sortF(item_a) : item_a[byKey]
        const b = sortF ? sortF(item_b) : item_b[byKey]

        if (sortDir === SortDirection.asc) {
            if (a > b) {
                return 1
            } else if (b > a) {
                return -1
            }
            return 0
        } else if (sortDir === SortDirection.desc) {
            if (a < b) {
                return 1
            } else if (b < a) {
                return -1
            }
            return 0
        } 

        return 0
        
    })
}

export const nextSortDirection = (currSortDirection: SortDirection | null) : SortDirection | null => {

    return currSortDirection === SortDirection.desc ? 
            SortDirection.asc : 
            currSortDirection === SortDirection.asc ? 
                null : 
                SortDirection.desc
}