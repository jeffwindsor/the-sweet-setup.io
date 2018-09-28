import { GraphQLServer } from '../node_modules/graphql-yoga'
import { script } from './resolvers/script';

// Wire and Start
const server = new GraphQLServer({
  typeDefs: './src/schemas/schema.graphql',
  resolvers: {
    Query: {
      description: () => `The Sweet Setup's Queryable Graph`,
      script: (obj, {addHeader, os, language, requests }, context, info) => script(addHeader, os, language, requests)
    }
  }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))



// ? Can save custom "recipes" for later under "TBD" package type. Like Install shell as default
// may be too specific for this area and defined by prior query that creates input
//    package manager update
//    prompts: fish, bash git
//    workflows: aws, git, stack, etc...  (shell specific.. how to split to multishells: probably in prevois step)

//AST FOR FUNCTIONS needs to be more complete: loops, multi args etc

// ? output pretty info
// ? args to [String] so we can cycle over them
// ? Custom package type for things like haskell stack or haskell_ide_server that have multiple custom steps
// ? TODO: see if i can reduce to name instead of these repeated function calls
// call resolver function dynamically
// load resolvers by folder dynamically