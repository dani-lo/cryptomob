import { getAppStaticSettings } from "./store/static"

const staticSettings = getAppStaticSettings()


export const API_BASE = process.env.NODE_ENV === 'production' ? staticSettings.url : 'http://localhost:8080'
export const GRAPHQL_ENDPOINT = `${ API_BASE }/graphql`