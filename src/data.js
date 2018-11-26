const addgitglobals = [
    {gitconfig:"alias.s",value:"status -sb --ignore-submodules"},
    {gitconfig:"alias.d",value:"diff"},
    {gitconfig:"alias.aa",value:"add --all"},
    {gitconfig:"alias.cm",value:"commit -m"},
    {gitconfig:"alias.cma",value:"commit -a -m"},
    {gitconfig:"alias.b",value:"branch"},
    {gitconfig:"alias.co",value:"checkout"},
    {gitconfig:"alias.cob",value:"checkout -b"},
    {gitconfig:"alias.pff",value:"pull --ff-only"},
    {gitconfig:"alias.mff",value:"merge --ff-only"},
    {gitconfig:"alias.size",value:"count-objects -vH"},
    {gitconfig:"alias.remove",value:"rm -r --cached ."},
    {gitconfig:"alias.hist",value:"log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an :%C(dim)%cr%C(reset)\" --abbrev-commit"}
  ];
const addvscodeextensions = [
    {codeext:"aaron-bond.better-comments"},
    {codeext:"andys8.jest-snippets"},
    {codeext:"dcasella.monokai-plusplus"},
    {codeext:"dracula-theme.theme-dracula"},
    {codeext:"eamodio.gitlens"},
    {codeext:"file-icons.file-icons"},
    {codeext:"ginfuru.ginfuru-better-solarized-dark-theme"},
    {codeext:"justusadam.language-haskell"},
    {codeext:"ms-python.python"},
    {codeext:"nwolverson.language-purescript"},
    {codeext:"Orta.vscode-jest"},
    {codeext:"PKief.material-icon-theme"},
    {codeext:"Prisma.vscode-graphql"},
    {codeext:"skyapps.fish-vscode"},
    {codeext:"streetsidesoftware.code-spell-checker"},
    {codeext:"tomoki1207.pdf"},
    {codeext:"wmaurer.change-case"}
  ];
const installhomebrew = [
    {$:"ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\";"},
    {$:"brew tap caskroom/cask"},
    {$:"brew tap caskroom/versions"},
    {$:"brew tap homebrew/cask"}
  ]
  .concat(aliasesbrew);

const installyay = [
    {gitclone:"https://aur.archlinux.org/yay.git",output_dir:"~/src/yay"},
    {$:"cd ~/src/yay"},
    {$:"makepkg -i"}
  ];
const setfishasdefault = [];


const aliasesbrew = [
    {name:"b",body:"brew install {$1}"},
    {name:"bi",body:"brew info {$1}"},
    {name:"bc",body:"brew cask install {$1}"},
    {name:"bup",body:"brew update; brew upgrade; brew prune; brew cleanup; brew doctor; brew cask upgrade; brew cask doctor;"}
  ];
const aliasesgitworkflow = [
    {name:"gpush",body:"git push"},
    {name:"gpull",body:"git pull --rebase --prune\n  git submodule update --init --recursive"},
    {name:"gundo",body:"git reset HEAD~1 --mixed"},
    {name:"greset",body:"git add -A\n  git commit -qm \"CLEAN POINT\"\n  git reset HEAD~1 --hard\n  git clean -f -d"},
    {name:"ginit",body:"git init\n  gi osx >> .gitignore\n  echo \"READ.ME\" >> README.md\n  gcommit \"Initial\"\n  if test -n ${@}\n    gconnect $repo_uri\n    git push -u origin master\n  end"},
    {name:"gbranch",body:"git checkout -b ${@}"},
    {name:"gcommit",body:"git add -A\n  if test -n \"${@}\"\n        git commit -m \"${@}\"\n    else\n        git commit -m \"WIP\"\n    end"},
    {name:"gmerge",body:"set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n  git checkout master\n  gpull\n  git rebase -i master\n  git merge $merge_branch"},
    {name:"gtrack",body:"git checkout --track origin/${@}"},
    {name:"gforget",body:"git rm -r --cached .\n  git add .\n  git commit -am \"Remove ignored files\""},
    {name:"gmerge-ours",body:"set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n git merge -s ours master\n  git checkout master\n  git merge $merge_branch"},
    {name:"gi",body:"curl -L -s https://www.gitignore.io/api/${1}"}
  ];
const aliasesgit = [
    {name:"gs",body:"git status -sb --ignore-submodules"},
    {name:"gd",body:"git diff"},
    {name:"gaa",body:"git add --all"},
    {name:"gc",body:"git clone"},
    {name:"gcm",body:"git commit -m"},
    {name:"gcma",body:"git commit -a -m"},
    {name:"gb",body:"git branch"},
    {name:"gco",body:"git checkout"},
    {name:"gcob",body:"git checkout -b"},
    {name:"gpff",body:"git pull --ff-only"},
    {name:"gmff",body:"git merge --ff-only"},
    {name:"gsize",body:"git count-objects -vH"},
    {name:"gremove",body:"git rm -r --cached ."},
    {name:"gi",body:"curl -L -s https://www.gitignore.io/api/${1}"},
    {name:"gh",body:"git clone git clone https://github.com/${@}.git"},
    {name:"ghp",body:"git clone git clone https://github.com/jeffwindsor/${@}.git"},
    {name:"ghist",body:"git log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an :%C(dim)%cr%C(reset)\" --abbrev-commit"}
  ];
const aliaseshaskellstack = [
    {name:"s",body:"stack repl"},
    {name:"sb",body:"stack build"},
    {name:"sbc",body:"stack clean; stack build"},
    {name:"sinit",body:"stack new ${1};  cd ${1}; stack setup;  stack build;"},
    {name:"st",body:"stack test"},
    {name:"stf",body:"stack test --file-watch"},
    {name:"sd",body:"stack list-dependencies"}
  ];
const aliasesnpm = [
    {name:"ni",body:"npm install ${@}"},
    {name:"ns",body:"npm run start"},
    {name:"nt",body:"npm run test"},
    {name:"nreset",body:"npm install; npm prune; npm doctor;"}
  ];
const aliasespulp = [
    {name:"pi",body:"pulp init"},
    {name:"pb",body:"pulp build"},
    {name:"pt",body:"pulp test"},
    {name:"padd",body:"bower install ${1} --save"}
  ];
const aliasesshell = [
    {name:"f",body:"functions ${1}"},
    {name:"l",body:"builtin ls -CF"},
    {name:"ll",body:"builtin ls -lhA"},
    {name:"lll",body:"builtin ls -lhFA | less"},
    {name:"o",body:"builtin open ."},
    {name:"c",body:"code ."},
    {name:"cd..",body:"cd .."},
    {name:"...",body:"cd ../../"},
    {name:"....",body:"cd ../../../"},
    {name:".....",body:"cd ../../../../"},
    {name:"evalinsubs",body:"for d in (ls -d */ | cut -f1 -d\"/\")\n    cd $d\n    echo \"==> $d\"\n    eval ${@}\n    cd ..\n  end"}
  ];
const aliasesyay= [
    {name:"y",body:"yay -Ss {$1}"},
    {name:"yi",body:"yay -Si --noconfirm {$1}"},
    {name:"ys",body:"yay {$1}"},
    {name:"yup",body:"yay -Syu; yay -Yc;"}
  ];

const commandbrew = {brew:"package"};
const commandcask = {cask:"package"};
const commandcode = {codeext:"extension"};
const commandcommand = {$:"ls -a"};
const commandcomment = {comment:"comment"};
const commandcurl = {curl:"uri",args:"arguments",target:{operator:"redirect",path:"some/path"}};
const commandecho = {echo:"message"};
const commandfile = {file:"content",target:{operator:"redirect",path:"some/path"}};
const commandgitclone = {gitclone:"uri",args:"arguments",output_dir:"dir"};
const commandgitconfig = {gitconfig:"name",value:"configvalue"};
const commandnpm = {npm:"package"};
const commandpacman = {pacman:"package"};
const commandstack = {stack:"package"};
const commandvariable = {variable:"name",value:"variable"};
const commandyay = {yay:"package"};


const adddevaliases = aliasesgit
  .concat(aliasesgitworkflow)
  .concat(aliaseshaskellstack)
  .concat(aliasesnpm)
  .concat(aliasespulp)
  .concat(aliasesshell);

const scriptmacos = installhomebrew
  .concat([
    {cask:"fantastical"},
    {cask:"keybase"},
    {cask:"kindle"},
    {cask:"slack"},
    {cask:"spotify"},
    {cask:"google-hangouts"},
    {cask:"google-backup-and-sync"},
    {cask:"brave"},
    {cask:"google-chrome"}
  ]);

const scriptmacosdev = [
    {cask:"tor"},
    {cask:"iterm2"},
    {brew:"bash"},
    {brew:"fish"},
    {brew:"oh-my-fish"},
    {brew:"coreutils"},
    {brew:"wget"},
    {brew:"vim"},
    {brew:"tree"},
    {cask:"python3"},
    {cask:"pylint"},
    {cask:"node"},
    {brew:"git"}]
  .concat(addgitglobals)
  .concat([
    {brew:"haskell-stack"},
    {description:"GHCI Timer","file":":set +s",target:{operator:"redirect",path:".ghci"}},
    {description:"GHCI Prompt","file":":set prompt \"\\ESC[38;5;45mλ \\ESC[0m\"",target:{operator:"redirectappend",path:".ghci"}},
    {cask:"visual-studio-code"}])
  .concat(addvscodeextensions)
  .concat([
    {gitclone:"https://github.com/google/fonts.git",args:"--depth=1",output_dir:"~/src/sys/google/fonts"},
    {gitclone:"https://github.com/powerline/fonts.git",args:"--depth=1",output_dir:"~/src/sys/powerline/fonts"}])
  .concat(adddevaliases);

const scriptmanjaro = [
  {$:"sudo pacman-mirrors --fasttrack"},
  {$:"sudo pacman -Syyu"},
  {pacman:"fish"},
  {curl:"https://get.oh-my.fish", args:"-L", target:{operator:"pipe", path:"fish"}}
  ]
  .concat(installyay)
  .concat(aliasesyay);

const scriptmanjarodev = [
    {pacman:"vim"},
    {pacman:"python3"},
    {pacman:"pylint"},
    {pacman:"node"},
    {pacman:"git"},
    {pacman:"stack"},
    {description:"GHCI Timer","file":":set +s",target:{operator:"redirect",path:".ghci"}},
    {description:"GHCI Prompt","file":":set prompt \"\\ESC[38;5;45mλ \\ESC[0m\"",target:{operator:"redirectappend",path:".ghci"}},
    {pacman:"code"},
    {gitclone:"https://github.com/google/fonts.git",args:"--depth=1",output_dir:"~/src/sys/google/fonts"},
    {gitclone:"https://github.com/powerline/fonts.git",args:"--depth=1",output_dir:"~/src/sys/powerline/fonts"},
  ].concat(addvscodeextensions)
   .concat(addgitglobals)
   .concat(adddevaliases);

const scripti3 = [];
const scriptgnome3 = [];