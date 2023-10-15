
import { SortDirection } from "../helpers/sort";

export interface FetchParams<T> {
    offset: number;
    limit: number;
    sortBy: T;
    sortDir: SortDirection;
    dateFrom: Date;
    dateTo: Date;
    whereTags?: number[];
    whereAuthor?: number[];
    whereCategories?: number[];
    minItems?: QueryFilterParamsMinItems
}

export interface QueryFilterParamsMinItems {
    tagged ?: boolean;
    userTagged?: boolean;
    commented?: boolean;
    watchlisted?: boolean;
    categoryized?: boolean;
    authored?: boolean;
    userAdded?: boolean;
    bookmarked?: boolean;
}

export interface QueryFilterParams {
    authors: number[];
    tags: number[];
    categories: number[];
    hashtags: number[];
    minItems: QueryFilterParamsMinItems
}

export const limitOptions = [12, 18, 24, 30, 36, 42, 48].map(n => {
    return { value: `${ n }`, label: `${ n } per page`}
})

// export class ObservableStoreFetchParams<T> extends StoreBase {
    
//     value: FetchParams<T>

//     constructor(value: FetchParams<T>) {

//         super()

//         makeObservable(this, {
//             value: observable,
//             params: computed,
//             setParams: action,
//         })
//         this.value = value
//     }

//     get params() {
//         return this.value
//     }

//     setParams (valuePartial: Partial<FetchParams<T>>) {
//         this.value = Object.assign({}, this.value, valuePartial)
//     }
// }

// export class ObservableStoreFilterParams extends StoreBase {
    
//     value: QueryFilterParams
//     pubValue: QueryFilterParams

//     constructor(value: QueryFilterParams) {

//         super()

//         this.value = {
//             tags: value.tags,
//             authors: value.authors,
//             categories: value.categories,
//             hashtags: value.hashtags,
//             minItems: {
//                 tags: false,
//                 userTags: false,
//                 comments: false,
//                 watchlist: false,
//                 category: false,
//                 author: false,
//                 userArticles: false
//             }
//         }
        
//         this.pubValue = { 
//             tags: value.tags,
//             authors: value.authors,
//             categories: value.categories,
//             hashtags: value.hashtags,
//             minItems: {
//                 tags: false,
//                 userTags: false,
//                 comments: false,
//                 watchlist: false,
//                 category: false,
//                 author: false,
//                 userArticles: false,
//             }
//          }

//         makeObservable(this, {
//             value: observable,
//             pubValue: observable,
//             filters: computed,
//             pubFilters: computed,
//             publish: action,
//             setParams: action,
//         })
//     }

//     get filters() {
//         return this.value
//     }

//     get pubFilters() {
//         return this.pubValue
//     }

//     setParams (valuePartial: Partial<QueryFilterParams>) {        
//         this.value = Object.assign({}, this.value, valuePartial)
//     }

//     publish (valKey: keyof QueryFilterParams) {
        
//         this.pubValue = Object.assign({}, this.pubValue, { [valKey]: this.value[valKey]})
//     }

//     isChanged (valKey: keyof Pick<QueryFilterParams, 'authors' | 'categories' | 'hashtags' | 'tags'>) {

//         const firstItem : number[] | number = !!this.value[valKey] ? this.value[valKey] : []  as number[] | number
//         const secondItem = !!this.pubValue[valKey] ? this.pubValue[valKey] : [] as number[] | number

//         return compareNumericArraysOrNumbers(firstItem, secondItem)
        
//     }

//     isChangedBools () {

//         return compareObjects(this.value.minItems, this.pubValue.minItems)
//     }

//     nonReactiveInit (valKey: keyof QueryFilterParams, val: any) {
        
//         this.value[valKey] = Array.isArray(val) ? [...val] : val
//         this.pubValue[valKey] = Array.isArray(val) ? [...val] : val
//     }
// }