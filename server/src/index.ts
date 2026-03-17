import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { loadTypeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

async function main() {
  const server = new ApolloServer({
    typeDefs: loadTypeDefs(),
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  // eslint-disable-next-line no-console
  console.log(`GraphQL server ready at ${url}`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

