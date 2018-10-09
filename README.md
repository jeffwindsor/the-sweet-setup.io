[Home](https://jeffwindsor.carrd.co/) > [Github](https://jeffwindsor.github.com) > [Projects](https://jeffwindsor.github.com/projects) > The Sweet Setup IO

A queryable and compose-able setup script generator.  A conversion of [the sweet setup](https://github.com/jeffwindsor/the-sweet-setup) into web based solution, while learning graphql.


## Dependencies

|Name|Notes|
|---|---|
|`graphql-yoga` |  [github](https://github.com/prisma/graphql-yoga)|
|`babel` | [github](https://github.com/babel/babel)|
|`jest` | [github](https://github.com/facebook/jest)|
|`gitignore.io` |[gitignore.io](https://www.gitignore.io/)|

<hr/>

## Create Project

`start-from-scratch.sh`

```sh
#Project Directory
mkdir the-sweet-setup.io
cd the-sweet-setup.io

#Npm Packages
npm add graphql-yoga
echo '{\n  "schemaPath": "./src/schemas/schema.graphql"\n}' > .graphqlconfig
npm i Babel babel-jest jest
echo '{\n  "presets": ["env"]\n}' > .babelrc
mkdir bin
echo "require('babel-register');\nrequire('./../src/index');" > ./bin/dev

#Directories and Files
mkdir server
touch server/index.js
touch server/schema.graphql

#Git
curl -L -s https://www.gitignore.io/api/node >> .gitignore
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

`package.json` add the following for `npm run`:

```json
"scripts": {
    "start": "node src/index.js",
    "dev":   "node bin/dev",
    "test":  "jest"
  }
```

`LICENSE` : [GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/#license-text)
