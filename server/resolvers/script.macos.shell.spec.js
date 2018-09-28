import { script } from './script'

function run(requests, expected, addHeader=false){
  expect(script(addHeader,'MacOs','Shell', requests)).toEqual(expected);
};
function runCheckMultipleResults(requests, addHeader=false){
  let actuals = script(addHeader,'MacOs','Shell', requests);
  expect(actuals.length).toBeGreaterThan(1);
};


describe('Given a request for MacOS and SH when scripted', () => {

  test('Comment', () => run(
    [{type: "Comment", name: "comment"}],
    ["#comment"]));

  test('Info', () => run(
    [{type: "Info", name:"Test Section"}],
    ["echo -e '==> Test Section'"]));

  test('Variable', () => run(
    [{type: "Variable", name:"name", value:"value"}],
    ["name=value"]));

  test('ArchPackage', () => run(
    [{type: "ArchPackage", name:"arch"}],
    ["sudo pacman -S --noconfirm arch"]));

  test('YayPackage', () => run(
    [{type: "YayPackage", name:"aur"}],
    ["yay -S --noconfirm aur"]));

  test('BrewPackage', () => run(
    [{type: "BrewPackage", name:"brew"}],
    ["brew install brew"]));

  test('CaskPackage', () => run(
    [{type: "CaskPackage", name:"cask"}],
    ["brew cask install cask"]));

  test('NpmPackage', () => run(
    [{type: "NpmPackage", name:"npm"}],
    ["npm install npm"]));

  test('VsCodeExtension', () => run(
    [{type: "VsCodeExtension", name:"vsc"}],
    ["code --install-extension vsc"]));

  test('HaskellStackInstall', () => run(
    [{type: "HaskellStackInstall", name:"package"}],
    ["stack install package"]));

  test('GitGlobal', () => run(
    [{type: "GitGlobal", name:"alias ga", value:"git action"}],
    ["git config --global alias ga 'git action'"]));

  test('GitClone', () => run(
    [{type: "GitClone", name:"http://url.git"}],
    ["git clone http://url.git"]));

  test('GitClone to target', () => run(
    [{type: "GitClone", name:"http://url-target.git", target:{operator:"None", path:"/user/home/two-x"}}],
    ["git clone http://url-target.git /user/home/two-x"]
    ));

  test('GitClone with args to target ', () => run(
    [{type: "GitClone", name:"http://url-target-args.git", target:{operator:"None", path:"/user/home/two-x"}, args:"--depth=1"}],
    ["git clone http://url-target-args.git /user/home/two-x --depth=1"]
    ));

  test('GitClone with args', () => run(
    [{type: "GitClone", name:"http://url-target-args.git", args:"--depth=1"}],
    ["git clone http://url-target-args.git --depth=1"]
    ));

  test('Curl', () => run(
    [{type: "Curl", name:"http://url.git"}],
    ["curl http://url.git"]
    ));

  test('Curl with args', () => run(
    [{type: "Curl", name:"http://url-args.git", args:"-L"}],
    ["curl -L http://url-args.git"]
    ));

  test('Curl with args to target', () => run(
    [{type: "Curl", name:"http://url-args-target.git", args:"-L", target:{operator:"Pipe", path:"sh"}}],
    ["curl -L http://url-args-target.git | sh"]
    ));

  test('Curl to target', () => run(
    [{type: "Curl", name:"http://url-target.git", target:{operator:"Pipe", path:"sh"}}],
    ["curl http://url-target.git | sh"]
    ));

  test('WriteToFile', () => run(
    [{type: "WriteToFile", name:"", value:":set prompt \"\\ESC[38;5;242m\\STX%s\n\\ESC[38;5;161m❯\\ESC[1;34mλ= \\ESC[0m\"", target:{operator:'RedirectOutput', path:"~/.ghci"}}],
    ["echo -e ':set prompt \"\\ESC[38;5;242m\\STX%s\n\\ESC[38;5;161m❯\\ESC[1;34mλ= \\ESC[0m\"' > ~/.ghci"]));
  });


describe('Given a transformable request for MacOS and SH when scripted', () => {

  test('BashFunctions are wrapped properly', () => run(
    [{type: "BashFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}}],
    ["echo -e 'function myfunction(){\nsomestuff\n}' >> /user/home/.bashrc"]));

  test('FishFunction are wrapped properly', () => run(
    [{type: "FishFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}}],
    ["echo -e 'function myfunction\nsomestuff\nend' >> /user/home/.fishrc"]));

  test('List of GitGlobalAliases returns multiple lines', () => runCheckMultipleResults(
    [{type: "List", name:"GitGlobalAliases"}]));

  test('List of BashGitAliases returns multiple lines', () => runCheckMultipleResults(
    [{type: "List", name:"BashGitAliases", target:{operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"}}],
    ));

  test('List of FishGitAliases returns multiple lines', () => runCheckMultipleResults(
    [{type: "List", name:"FishGitAliases",target:{operator:"RedirectOutput", path:"/user/home/.fish_git_aliases"} }],
    ));
});