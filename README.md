# THE SWEET SETUP IO

[Home](https://jeffwindsor.carrd.co/) > [Github](https://jeffwindsor.github.com) > [Projects](https://jeffwindsor.github.com/projects) > The Sweet Setup IO

A queryable and compose-able setup script generator.  A conversion of [the sweet setup](https://github.com/jeffwindsor/the-sweet-setup) into web based solution, while learning graphql.

<a href="https://codeclimate.com/github/jeffwindsor/the-sweet-setup.io/maintainability"><img src="https://api.codeclimate.com/v1/badges/ab3d23ae4d50118d95ac/maintainability" /></a> <a href="https://codeclimate.com/github/jeffwindsor/the-sweet-setup.io/test_coverage"><img src="https://api.codeclimate.com/v1/badges/ab3d23ae4d50118d95ac/test_coverage" /></a>

## Dependencies

|Name|Notes|
|---|---|
|`babel` | for testing [github](https://github.com/babel/babel)|
|`jest` | for testing [github](https://github.com/facebook/jest)|
|`gitignore.io` | [gitignore.io](https://www.gitignore.io/)|

<hr/>

## Create Project

`start-from-scratch.sh`

```sh
#Project Directory
mkdir the-sweet-setup.io
cd the-sweet-setup.io

#Npm Packages
npm i Babel babel-jest jest
echo '{\n  "presets": ["env"]\n}' > .babelrc
mkdir bin
echo "require('babel-register');\nrequire('./../src/index');" > ./bin/dev

#Directories and Files
mkdir server
touch server/index.js

#Git
curl -L -s https://www.gitignore.io/api/node >> .gitignore
git init
git commit -m 'Initial'
```

`package.json` add the following for `npm run`:

```json
  "scripts": {
    "test": "jest --coverage --colors --watchAll"
  },
  "jest": {
    "collectCoverage": true,
    "coverageReporters":["lcov"],
    "coverageDirectory":"spec",
    "collectCoverageFrom": ["js/*.js"]
  },
```

`LICENSE` : [GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/#license-text)
