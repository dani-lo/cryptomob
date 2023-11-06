import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:8080/graphql': {
        // headers: {
        //   'x-hasura-admin-secret': 'nhost-admin-secret',
        // },
      },
    },
  ],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      documents: ['src/**/*.tsx'],
      preset: 'client',
      plugins: [],
    },
  },
}

export default config