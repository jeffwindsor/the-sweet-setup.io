# THE SWEET SETUP IO

[Home](https://jeffwindsor.carrd.co/) > [Github](https://jeffwindsor.github.com) > [Projects](https://jeffwindsor.github.com/projects) > The Sweet Setup IO

A queryable and compose-able setup script generator.  A conversion of [the sweet setup](https://github.com/jeffwindsor/the-sweet-setup) into web based solution, while learning graphql.

## Credits (:pray:)

* Front End Icons : [font awesome](https://fontawesome.com/)
* Front End Components : [bootstrap](https://getbootstrap.com/)
* Multilevel Drop Downs : [W3 School](https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_ref_js_dropdown_multilevel_css&stacked=h)
* JS Compiler : [babel](https://github.com/babel/babel)
* Testing : [jest](https://github.com/facebook/jest)
* Git Ignore Templates : [gitignore.io](https://www.gitignore.io/)
* Choosing a License : [Choose a License](https://choosealicense.com/)
* License : [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)

## How to create this project from scratch

```sh
#Project Directory
mkdir the-sweet-setup.io
cd the-sweet-setup.io

#License (GPLv3)
curl -L -s https://www.gnu.org/licenses/gpl.txt >> LICENSE

#Npm Packages
npm i Babel babel-jest jest
echo '{\n  "presets": ["env"]\n}' > .babelrc
mkdir bin
echo "require('babel-register');\nrequire('./../src/index');" > ./bin/dev

#Directories and Files
mkdir src
touch src/index.js
touch src/scripting.js
mkdir css
touch css/index.css
mkdir spec

#Git
curl -L -s https://www.gitignore.io/api/node >> .gitignore
git init
git commit -m 'Initial'
```

`package.json` adds:

```json
  "scripts": {
    "test": "jest"
  },
```