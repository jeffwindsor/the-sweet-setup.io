[Home](https://jeffwindsor.carrd.co/) > [Github](https://jeffwindsor.github.com) > [Projects](https://jeffwindsor.github.com/projects) > The Sweet Setup IO

A queryable and compose-able setup script generator.  A conversion of [the sweet setup](https://github.com/jeffwindsor/the-sweet-setup) into web based solution, while learning graphql.

## Api (documentation incomplete)

### Request Object Examples
```json
{type: Info, name:"Test Section"},
{type: Variable, name:"name", value:"value"},
{type: ArchPackage, name:"arch"},
{type: YayPackage, name:"aur"},
{type: BrewPackage, name:"brew"},
{type: CaskPackage, name:"cask"},
{type: NpmPackage, name:"npm"},
{type: VsCodeExtension, name:"vsc"},
{type: HaskellStackInstall, name:"stack"},
{type: BashFunction, name:"myfunction", value:"somestuff", target:{operator:RedirectOutputAppend, path:"/user/home/.bashrc"}},
{type: FishFunction, name:"myfunction", value:"somestuff", target:{operator:RedirectOutput, path:"/user/home/.config/fish/functions"}},
{type: GitGlobal, name:"alias ga", value:"git action"},
{type: GitGlobal, name:"user.name", value:"yahoo serious"},
{type: GitClone, name:"http://url.git"},
{type: GitClone, name:"http://url-target.git", target:{operator:None, path:"/user/home/two-x"}},
{type: GitClone, name:"http://url-target-args.git", target:{operator:None, path:"/user/home/two-x"}, args:"--depth=1"},
{type: GitClone, name:"http://url-args.git", args:"--depth=1"},
{type: Curl, name:"http://url.git"},
{type: Curl, name:"http://url-args.git", args:"-L"},
{type: Curl, name:"http://url-args-target.git", args:"-L", target:{operator:Pipe, path:"sh"}},
{type: Curl, name:"http://url-target.git", target:{operator:Pipe, path:"sh"}},
{type: WriteToFile, name:"", value:":set prompt '\\ESC[38;5;242m\\STX%s\n\\ESC[38;5;161m❯\\ESC[1;34mλ= \\ESC[0m'", target:{operator:RedirectOutput, path:"~/.ghci"}},
{type: List, name:"GitAliases"},
{type: List, name:"BashGitAliases", target:{operator:RedirectOutputAppend, path:"/user/home/.bash_git_aliases"}},
{type: List, name:"FishGitAliases" target:{operator:RedirectOutput, path:"/user/home/.fish_git_aliases"} }
```


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
