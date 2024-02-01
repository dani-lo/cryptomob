export const API_BASE = process.env.NODE_ENV === 'production' ? 'https://13.42.158.126:8080' : 'http://localhost:8080'
export const GRAPHQL_ENDPOINT = `${ API_BASE }/graphql`