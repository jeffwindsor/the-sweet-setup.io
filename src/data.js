const addgitglobals = [
    { gitconfig: "alias.s", value: "status -sb --ignore-submodules" },
    { gitconfig: "alias.d", value: "diff" },
    { gitconfig: "alias.aa", value: "add --all" },
    { gitconfig: "alias.cm", value: "commit -m" },
    { gitconfig: "alias.cma", value: "commit -a -m" },
    { gitconfig: "alias.b", value: "branch" },
    { gitconfig: "alias.co", value: "checkout" },
    { gitconfig: "alias.cob", value: "checkout -b" },
    { gitconfig: "alias.pff", value: "pull --ff-only" },
    { gitconfig: "alias.mff", value: "merge --ff-only" },
    { gitconfig: "alias.size", value: "count-objects -vH" },
    { gitconfig: "alias.remove", value: "rm -r --cached ." },
    { gitconfig: "alias.hist", value: "log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an : %C(dim)%cr%C(reset)\" --abbrev-commit" }
  ];
const addvscodeextensions = [
    { codeext: "aaron-bond.better-comments" },
    { codeext: "andys8.jest-snippets" },
    { codeext: "dcasella.monokai-plusplus" },
    { codeext: "dracula-theme.theme-dracula" },
    { codeext: "eamodio.gitlens" },
    { codeext: "file-icons.file-icons" },
    { codeext: "ginfuru.ginfuru-better-solarized-dark-theme" },
    { codeext: "justusadam.language-haskell" },
    { codeext: "ms-python.python" },
    { codeext: "nwolverson.language-purescript" },
    { codeext: "Orta.vscode-jest" },
    { codeext: "PKief.material-icon-theme" },
    { codeext: "Prisma.vscode-graphql" },
    { codeext: "skyapps.fish-vscode" },
    { codeext: "streetsidesoftware.code-spell-checker" },
    { codeext: "tomoki1207.pdf" },
    { codeext: "wmaurer.change-case" }
  ];
const installhomebrew = [
    { command: "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\";"},
    { command: "brew tap caskroom/cask"},
    { command: "brew tap caskroom/versions"},
    { command: "brew tap homebrew/cask"}
  ];
const installyay = [
    { gitclone: "https://aur.archlinux.org/yay.git", output_dir: "~/src/yay" },
    { command:"cd ~/src/yay"},
    { command:"makepkg -i"}
  ];
const setfishasdefault = [];


const aliasesbrew = [
    { fishfunction: "b", functionbody: "brew install {$1}" },
    { fishfunction: "bi", functionbody: "brew info {$1}" },
    { fishfunction: "bc", functionbody: "brew cask install {$1}" },
    { fishfunction: "bup", functionbody: "brew update; brew upgrade; brew prune; brew cleanup; brew doctor; brew cask upgrade; brew cask doctor;" }
  ];
const aliasesgitworkflow = [
    { fishfunction: "gpush", functionbody: "git push" },
    { fishfunction: "gpull", functionbody: "git pull --rebase --prune\n  git submodule update --init --recursive" },
    { fishfunction: "gundo", functionbody: "git reset HEAD~1 --mixed" },
    { fishfunction: "greset", functionbody: "git add -A\n  git commit -qm \"CLEAN POINT\"\n  git reset HEAD~1 --hard\n  git clean -f -d" },
    { fishfunction: "ginit", functionbody: "git init\n  gi osx >> .gitignore\n  echo \"READ.ME\" >> README.md\n  gcommit \"Initial\"\n  if test -n ${@}\n    gconnect $repo_uri\n    git push -u origin master\n  end" },
    { fishfunction: "gbranch", functionbody: "git checkout -b ${@}" },
    { fishfunction: "gcommit", functionbody: "git add -A\n  if test -n \"${@}\"\n        git commit -m \"${@}\"\n    else\n        git commit -m \"WIP\"\n    end" },
    { fishfunction: "gmerge", functionbody: "set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n  git checkout master\n  gpull\n  git rebase -i master\n  git merge $merge_branch" },
    { fishfunction: "gtrack", functionbody: "git checkout --track origin/${@}" },
    { fishfunction: "gforget", functionbody: "git rm -r --cached .\n  git add .\n  git commit -am \"Remove ignored files\"" },
    { fishfunction: "gmerge-ours", functionbody: "set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n git merge -s ours master\n  git checkout master\n  git merge $merge_branch" },
    { fishfunction: "gi", functionbody: "curl -L -s https://www.gitignore.io/api/${1}" }
  ];
const aliasesgit = [
    { fishfunction: "gs", functionbody: "git status -sb --ignore-submodules" },
    { fishfunction: "gd", functionbody: "git diff" },
    { fishfunction: "gaa", functionbody: "git add --all" },
    { fishfunction: "gc", functionbody: "git clone" },
    { fishfunction: "gcm", functionbody: "git commit -m" },
    { fishfunction: "gcma", functionbody: "git commit -a -m" },
    { fishfunction: "gb", functionbody: "git branch" },
    { fishfunction: "gco", functionbody: "git checkout" },
    { fishfunction: "gcob", functionbody: "git checkout -b" },
    { fishfunction: "gpff", functionbody: "git pull --ff-only" },
    { fishfunction: "gmff", functionbody: "git merge --ff-only" },
    { fishfunction: "gsize", functionbody: "git count-objects -vH" },
    { fishfunction: "gremove", functionbody: "git rm -r --cached ." },
    { fishfunction: "gi", functionbody: "curl -L -s https://www.gitignore.io/api/${1}" },
    { fishfunction: "gh", functionbody: "git clone git clone https://github.com/${@}.git" },
    { fishfunction: "ghp", functionbody: "git clone git clone https://github.com/jeffwindsor/${@}.git" },
    { fishfunction: "ghist", functionbody: "git log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an : %C(dim)%cr%C(reset)\" --abbrev-commit" }
  ];
const aliaseshaskellstack = [
    { fishfunction: "s", functionbody: "stack repl" },
    { fishfunction: "sb", functionbody: "stack build" },
    { fishfunction: "sbc", functionbody: "stack clean\n  stack build" },
    { fishfunction: "st", functionbody: "stack test" },
    { fishfunction: "stf", functionbody: "stack test --file-watch" },
    { fishfunction: "sd", functionbody: "stack list-dependencies" }
  ];
const aliasesnpm = [
    { fishfunction: "ni", functionbody: "npm install ${@}" },
    { fishfunction: "ns", functionbody: "npm run start" },
    { fishfunction: "nt", functionbody: "npm run test" },
    { fishfunction: "nreset", functionbody: "npm install; npm prune; npm doctor;" }
  ];
const aliasespulp = [
    { fishfunction: "pi", functionbody: "pulp init" },
    { fishfunction: "pb", functionbody: "pulp build" },
    { fishfunction: "pt", functionbody: "pulp test" },
    { fishfunction: "padd", functionbody: "bower install ${1} --save" }
  ];
const aliasesshell = [
    { fishfunction: "f", functionbody: "functions ${1}" },
    { fishfunction: "l", functionbody: "builtin ls -CF" },
    { fishfunction: "ll", functionbody: "builtin ls -lhA" },
    { fishfunction: "lll", functionbody: "builtin ls -lhFA | less" },
    { fishfunction: "o", functionbody: "builtin open ." },
    { fishfunction: "c", functionbody: "code ." },
    { fishfunction: "cd..", functionbody: "cd .." },
    { fishfunction: "...", functionbody: "cd ../../" },
    { fishfunction: "....", functionbody: "cd ../../../" },
    { fishfunction: ".....", functionbody: "cd ../../../../" },
    { fishfunction: "evalinsubs", functionbody: "for d in (ls -d */ | cut -f1 -d\"/\")\n    cd $d\n    echo \"==> $d\"\n    eval ${@}\n    cd ..\n  end" }
  ];
const aliasesyay= [
    { fishfunction: "y", functionbody: "yay -Ss {$1}" },
    { fishfunction: "yi", functionbody: "yay -Si --noconfirm {$1}" },
    { fishfunction: "ys", functionbody: "yay {$1}" },
    { fishfunction: "yup", functionbody: "yay -Syu; yay -Yc;" }
  ];

const commandbrew = { brew: "package" };
const commandcask = { cask: "package" };
const commandcode = { codeext: "extension" };
const commandcommand = { command: "ls -a" };
const commandcomment = { comment: "comment" };
const commandcurl = { curl: "uri", args: "arguments", target: { operator: "redirect", path: "some/path" } };
const commandecho = {echo: "message"};
const commandfile = {file: "content", target: { operator: "redirect", path: "some/path" }};
const commandgitclone = {gitclone: "uri", args: "arguments", output_dir: "dir"};
const commandgitconfig = {gitconfig: "name", value: "configvalue"};
const commandnpm = {npm: "package"};
const commandpacman = {pacman: "package"};
const commandstack = {stack: "package"};
const commandvariable = {variable: "name", value: "variable"};
const commandyay = {yay: "package"};


const adddevaliases = aliasesgit
  .concat(aliasesgitworkflow)
  .concat(aliaseshaskellstack)
  .concat(aliasesnpm)
  .concat(aliasespulp)
  .concat(aliasesshell);

const scriptmacos = installhomebrew
  .concat(aliasesbrew)
  .concat([
    { cask:"fantastical"},
    { cask:"keybase"},
    { cask:"kindle"},
    { cask:"slack"},
    { cask:"spotify"},
    { cask:"google-hangouts"},
    { cask:"google-backup-and-sync"},
    { cask:"brave" },
    { cask:"google-chrome" }
  ]);

const scriptmacosdev = [
    {cask:"tor" },
    {cask:"iterm2" },
    {brew:"bash" },
    {brew:"fish" },
    {brew:"oh-my-fish" },
    {brew:"coreutils" },
    {brew:"wget" },
    {brew:"vim" },
    {brew:"tree" },
    {cask:"python3" },
    {cask:"pylint" },
    {cask:"node" },
    {brew:"git"}]
  .concat(addgitglobals)
  .concat([
    {brew:"haskell-stack" },
    {description:"GHCI Timer","file":":set +s",target: {operator:"redirect",path:".ghci" }},
    {description:"GHCI Prompt","file":":set prompt \"\\ESC[38;5;45mλ \\ESC[0m\"",target: {operator:"redirectappend",path:".ghci" }},
    {cask:"visual-studio-code" }])
  .concat(addvscodeextensions)
  .concat([
    {gitclone:"https://github.com/google/fonts.git",args:"--depth=1",output_dir:"~/src/sys/google/fonts" },
    {gitclone:"https://github.com/powerline/fonts.git",args:"--depth=1",output_dir:"~/src/sys/powerline/fonts" }])
  .concat(adddevaliases);

const scriptmanjaro = []
  .concat(installyay)
  .concat(aliasesyay);

const scriptmanjarodev = [
    {yay:"fish" },
    {yay:"oh-my-fish" },
    {yay:"vim" },
    {yay:"tree" },
    {yay:"python3" },
    {yay:"pylint" },
    {yay:"node" },
    {yay:"git"},
    {yay:"haskell-stack" },
    {description:"GHCI Timer","file":":set +s",target: {operator:"redirect",path:".ghci" }},
    {description:"GHCI Prompt","file":":set prompt \"\\ESC[38;5;45mλ \\ESC[0m\"",target: {operator:"redirectappend",path:".ghci" }},
    {yay:"visual-studio-code" },
    {gitclone:"https://github.com/google/fonts.git",args:"--depth=1",output_dir:"~/src/sys/google/fonts" },
    {gitclone:"https://github.com/powerline/fonts.git",args:"--depth=1",output_dir:"~/src/sys/powerline/fonts" },
  ].concat(addvscodeextensions)
   .concat(addgitglobals)
   .concat(adddevaliases);

const scripti3 = [];
const scriptgnome3 = [];