export const API_BASE = process.env.NODE_ENV === 'production' ? 'https://api.qrated-review.net' : 'http://localhost:8080'

export const GRAPHQL_ENDPOINT = `${ API_BASE }/graphql`