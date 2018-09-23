# The Sweet Setup IO

A queryable and compose-able setup script generator

## Re-Create from Scratch

`start-from-scratch.sh`

```bash
#Structure
mkdir the-sweet-setup.io
cd the-sweet-setup.io
mkdir src
mkdir resovlers
mkdir schemas
mkdir tests
#Files
curl -L -s https://www.gitignore.io/api/node >> .gitignore
touch src/index.js
touch src/schemas/schema.graphql
#Packages
npm add graphql-yoga
npm i esm
npm i jest
#Git
git init
git commit -m 'Initial'
```

`index.js`

```javascript
import { GraphQLServer } from '../node_modules/graphql-yoga';
import Query from './resolvers/query';

// Wire and Start
const server = new GraphQLServer({
  typeDefs: './src/schemas/schema.graphql',
  resolvers: { Query }
})
server.start(() => console.log(`Server is running on http://localhost:4000`));
```

`.graphqlconfig`

```json
{
  "schemaPath": "./src/schemas/schema.graphql"
}
```

`LICENSE` : [GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/#license-text)

## Dependencies

|Name|Notes|
|---|---|
|`graphql-yoga` |  [github](https://github.com/prisma/graphql-yoga)|
|`esm` | [github](https://github.com/standard-things/esm)|
|`jest` | [github](https://github.com/facebook/jest)|
|`gitignore.io` |[gitignore.io](https://www.gitignore.io/)|
