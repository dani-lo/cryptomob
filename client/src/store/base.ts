import { dateToPostgresDateString } from "../helpers/date"

export class StoreBase {
    
    public value: { [key: string]: any} = {}
    public pubValue?: { [key: string]: any} = {}

    public toCacheKey () {

        let cacheKey = ''

        let val = this.pubValue ? this.pubValue : this.value

        for (const key in val) {
            if (this.value.hasOwnProperty(key)) {
                
                const val = this.value[key]

                cacheKey = `${ cacheKey }-${  val instanceof Date ? dateToPostgresDateString(val) : val }`
            }
            
        }

        return cacheKey
    }
}