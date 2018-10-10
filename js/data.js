
function addPackage(name) {
  addToSource(eval(name));
}

const shell_aliases = {
  type:"fish-package",
  functions: [
    { function_name: "l", function_body: "builtin ls -CF" },
    { function_name: "ll", function_body: "builtin ls -lhA" },
    { function_name: "lll", function_body: "builtin ls -lhFA | less" },
    { function_name: "o", function_body: "builtin open ." },
    { function_name: "c", function_body: "code ." },
    { function_name: "cd..", function_body: "cd .." },
    { function_name: "...", function_body: "cd ../../" },
    { function_name: "....", function_body: "cd ../../../" },
    { function_name: ".....", function_body: "cd ../../../../" },
    { function_name: "evalinsubs", function_body: "for d in (ls -d */ | cut -f1 -d\"/\")\n    cd $d\n    echo \"==> $d\"\n    eval ${@}\n    cd ..\n  end" }
  ]
}

const pulp_aliases = {
  type:"fish-package",
  functions: [
    { function_name: "pi", function_body: "pulp init" },
    { function_name: "pb", function_body: "pulp build" },
    { function_name: "pt", function_body: "pulp test" },
    { function_name: "padd", function_body: "bower install ${1} --save" }
  ]
}

const npm_aliases = {
  type:"fish-package",
  functions: [
    { function_name: "ni", function_body: "npm install ${@}" },
    { function_name: "ns", function_body: "npm run start" },
    { function_name: "nt", function_body: "npm run test" }
  ]
}

const haskell_stack_aliases = {
  type:"fish-package",
  functions: [
    { function_name: "sb", function_body: "stack clean\n  stack build" },
    { function_name: "st", function_body: "stack test --file-watch" },
    { function_name: "sr", function_body: "stack repl" },
    { function_name: "sd", function_body: "stack list-dependencies" }
  ]
}

const git_workflow = {
  type:"fish-package",
  functions: [
    { function_name: "gpush", function_body: "git push" },
    { function_name: "gpull", function_body: "git pull --rebase --prune\n  git submodule update --init --recursive" },
    { function_name: "gundo", function_body: "git reset HEAD~1 --mixed" },
    { function_name: "greset", function_body: "git add -A\n  git commit -qm \"CLEAN POINT\"\n  git reset HEAD~1 --hard\n  git clean -f -d" },
    { function_name: "ginit", function_body: "git init\n  gi osx >> .gitignore\n  echo \"READ.ME\" >> README.md\n  gcommit \"Initial\"\n  if test -n ${@}\n    gconnect $repo_uri\n    git push -u origin master\n  end" },
    { function_name: "gbranch", function_body: "git checkout -b ${@}" },
    { function_name: "gcommit", function_body: "git add -A\n  if test -n \"${@}\"\n        git commit -m \"${@}\"\n    else\n        git commit -m \"WIP\"\n    end" },
    { function_name: "gmerge", function_body: "set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n  git checkout master\n  gpull\n  git rebase -i master\n  git merge $merge_branch" },
    { function_name: "gtrack", function_body: "git checkout --track origin/${@}" },
    { function_name: "gforget", function_body: "git rm -r --cached .\n  git add .\n  git commit -am \"Remove ignored files\"" },
    { function_name: "gmerge-ours", function_body: "set merge_branch (git symbolic-ref HEAD | sed -e \"s,.*/\\(.*\\),\\1,\")\n git merge -s ours master\n  git checkout master\n  git merge $merge_branch" },
    { function_name: "gi", function_body: "curl -L -s https://www.gitignore.io/api/${1}" }
  ]
}

const git_aliases = {
  type:"fish-package",
  functions: [
    { function_name: "gs", function_body: "git status -sb --ignore-submodules" },
    { function_name: "gd", function_body: "git diff" },
    { function_name: "gaa", function_body: "git add --all" },
    { function_name: "gc", function_body: "git clone" },
    { function_name: "gcm", function_body: "git commit -m" },
    { function_name: "gcma", function_body: "git commit -a -m" },
    { function_name: "gb", function_body: "git branch" },
    { function_name: "gco", function_body: "git checkout" },
    { function_name: "gcob", function_body: "git checkout -b" },
    { function_name: "gpff", function_body: "git pull --ff-only" },
    { function_name: "gmff", function_body: "git merge --ff-only" },
    { function_name: "gsize", function_body: "git count-objects -vH" },
    { function_name: "gremove", function_body: "git rm -r --cached ." },
    { function_name: "gi", function_body: "curl -L -s https://www.gitignore.io/api/${1}" },
    { function_name: "gh", function_body: "git clone git clone https://github.com/${@}.git" },
    { function_name: "ghp", function_body: "git clone git clone https://github.com/jeffwindsor/${@}.git" },
    { function_name: "ghist", function_body: "git log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an : %C(dim)%cr%C(reset)\" --abbrev-commit" }
  ]
}

const git_globals = {
  type:"gitconfig-package",
  globals: [
    { name: "alias.s", value: "status -sb --ignore-submodules" },
    { name: "alias.d", value: "diff" },
    { name: "alias.aa", value: "add --all" },
    { name: "alias.cm", value: "commit -m" },
    { name: "alias.cma", value: "commit -a -m" },
    { name: "alias.b", value: "branch" },
    { name: "alias.co", value: "checkout" },
    { name: "alias.cob", value: "checkout -b" },
    { name: "alias.pff", value: "pull --ff-only" },
    { name: "alias.mff", value: "merge --ff-only" },
    { name: "alias.size", value: "count-objects -vH" },
    { name: "alias.remove", value: "rm -r --cached ." },
    { name: "alias.hist", value: "log --graph --max-count=100 --pretty=format:\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an : %C(dim)%cr%C(reset)\" --abbrev-commit" }
  ]
}

const vscode_extensions = {
  type:"vscode-package",
  extensions: [
    { extension_name: "aaron-bond.better-comments" },
    { extension_name: "andys8.jest-snippets" },
    { extension_name: "dcasella.monokai-plusplus" },
    { extension_name: "dracula-theme.theme-dracula" },
    { extension_name: "eamodio.gitlens" },
    { extension_name: "file-icons.file-icons" },
    { extension_name: "ginfuru.ginfuru-better-solarized-dark-theme" },
    { extension_name: "justusadam.language-haskell" },
    { extension_name: "ms-python.python" },
    { extension_name: "nwolverson.language-purescript" },
    { extension_name: "Orta.vscode-jest" },
    { extension_name: "PKief.material-icon-theme" },
    { extension_name: "Prisma.vscode-graphql" },
    { extension_name: "skyapps.fish-vscode" },
    { extension_name: "streetsidesoftware.code-spell-checker" },
    { extension_name: "tomoki1207.pdf" },
    { extension_name: "wmaurer.change-case" }
  ]
}