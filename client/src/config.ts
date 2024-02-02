// import { getAppStaticSettings } from "./store/static"

// const staticSettings = getAppStaticSettings()


// export const API_BASE = 'http://13.43.110.236:8080' 
export const API_BASE = process.env.NODE_ENV === 'production' ? 'http://13.43.110.236:8080' : 'http://localhost:8080'

export const GRAPHQL_ENDPOINT = `${ API_BASE }/graphql`