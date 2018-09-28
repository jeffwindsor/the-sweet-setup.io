import { generate } from '../../src/resolvers/generate'


test('generate comment', () => testMacOsShell({type: "Comment", name: "comment"}, "#comment" ));
test('generate Info', () => testMacOsShell({type: "Info", name:"Test Section"}, "echo -e '==> Test Section'"));
test('generate Variable', () => testMacOsShell({type: "Variable", name:"name", value:"value"}, "name=value"));
test('generate ArchPackage', () => testMacOsShell({type: "ArchPackage", name:"arch"}, "sudo pacman -S --noconfirm arch"));
test('generate YayPackage', () => testMacOsShell({type: "YayPackage", name:"aur"}, "yay -S --noconfirm aur"));
test('generate BrewPackage', () => testMacOsShell({type: "BrewPackage", name:"brew"}, "brew install brew"));
test('generate CaskPackage', () => testMacOsShell({type: "CaskPackage", name:"cask"}, "brew cask install cask"));
test('generate NpmPackage', () => testMacOsShell({type: "NpmPackage", name:"npm"}, "npm install npm"));
test('generate VsCodeExtension', () => testMacOsShell({type: "VsCodeExtension", name:"vsc"}, "code --install-extension vsc"));
// test('generate comment', () => testMacOsShell({type: "HaskellStackInstall", name:"stack"}, ""));
// test('generate comment', () => testMacOsShell({type: "BashFunction", name:"myfunction", value:"somestuff", target:{operator:RedirectOutputAppend, path:"/user/home/.bashrc"}}, ""));
// test('generate comment', () => testMacOsShell({type: "FishFunction", name:"myfunction", value:"somestuff", target:{operator:RedirectOutput, path:"/user/home/.config/fish/functions"}}, ""));
// test('generate comment', () => testMacOsShell({type: "GitGlobal", name:"alias ga", value:"git action"}, ""));
// test('generate comment', () => testMacOsShell({type: "GitGlobal", name:"user.name", value:"yahoo serious"}, ""));
// test('generate comment', () => testMacOsShell({type: "GitClone", name:"http://url.git"}, ""));
// test('generate comment', () => testMacOsShell({type: "GitClone", name:"http://url-target.git", target:{operator:None, path:"/user/home/two-x"}}, ""));
// test('generate comment', () => testMacOsShell({type: "GitClone", name:"http://url-target-args.git", target:{operator:None, path:"/user/home/two-x"}, args:"--depth=1"}, ""));
// test('generate comment', () => testMacOsShell({type: "GitClone", name:"http://url-args.git", args:"--depth=1"}, ""));
// test('generate comment', () => testMacOsShell({type: "Curl", name:"http://url.git"}, ""));
// test('generate comment', () => testMacOsShell({type: "Curl", name:"http://url-args.git", args:"-L"}, ""));
// test('generate comment', () => testMacOsShell({type: "Curl", name:"http://url-args-target.git", args:"-L", target:{operator:Pipe, path:"sh"}}, ""));
// test('generate comment', () => testMacOsShell({type: "Curl", name:"http://url-target.git", target:{operator:Pipe, path:"sh"}}, ""));
// test('generate comment', () => testMacOsShell({type: "WriteToFile", name:"", value:":set prompt '\\ESC[38;5;242m\\STX%s\n\\ESC[38;5;161m❯\\ESC[1;34mλ= \\ESC[0m'", target:{operator:RedirectOutput, path:"~/.ghci"}}, ""));
// test('generate comment', () => testMacOsShell({type: "List", name:"GitAliases"}, ""));
// test('generate comment', () => testMacOsShell({type: "List", name:"BashGitAliases", target:{operator:RedirectOutputAppend, path:"/user/home/.bash_git_aliases"}}, ""));
// test('generate comment', () => testMacOsShell({type: "List", name:"FishGitAliases", target:{operator:RedirectOutput, path:"/user/home/.fish_git_aliases"} }, ""));

function testMacOsShell(token,expected){
  return testGenerate('MacOs','Shell', token, expected);
}
function testGenerate(os, language, token, expected){
  let actual = generate(os, language, token);
  expect(actual).toEqual(expected);
};