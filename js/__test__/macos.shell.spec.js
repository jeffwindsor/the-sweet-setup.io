//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const _ = require('lodash');
const rewire = require('rewire');
const scripting = rewire("../scripting.js");
const script = scripting.__get__('script');
const tokenize = scripting.__get__('tokenize');
scripting.__set__("_", _);
//=================================================

function run(request, expected) {
  expect(executeScript(request)).toEqual(["#!/bin/sh"].concat(expected));
}

function executeScript(request) {
  return script('MacOs', 'Shell', request);
}

describe('Given a request when scripted for MacOS and SH ', () => {

  test('Header gives she-bang bin sh', () => run(
    [{ type: "Header" }],
    ["#!/bin/sh"]));

  test('Comment gives a # comment', () => run(
    [{ type: "Comment", comment: "comment" }],
    ["#comment"]));

  test('Echo gives a ==> message', () => run(
    [{ type: "Echo", message: "Test Section" }],
    ["echo '==> Test Section'"]));

  test('Variable gives a name=value', () => run(
    [{ type: "Variable", name: "name", value: "value" }],
    ["name=value"]));

  test('Arch Package gives a pacman call', () => run(
    [{ type: "pacman", package_name: "arch" }],
    ["sudo pacman -S --noconfirm arch"]));

  test('Yay Package gives a yay call', () => run(
    [{ type: "Yay", package_name: "aur" }],
    ["yay -S --noconfirm aur"]));

  test('Brew Package', () => run(
    [{ type: "Brew", package_name: "brew" }],
    ["brew install brew"]));

  test('Cask Package', () => run(
    [{ type: "Cask", package_name: "cask" }],
    ["brew cask install cask"]));

  test('Npm Package', () => run(
    [{ type: "Npm", package_name: "npm" }],
    ["npm install npm"]));

  test('VS code install extension', () => run(
    [{ type: "code", extension_name: "vsc" }],
    ["code --install-extension vsc"]));

  test('Haskell Stack Install', () => run(
    [{ type: "Stack", package_name: "package" }],
    ["stack install package"]));

  test('git config global', () => run(
    [{ type: "gitconfig", name: "alias ga", value: "git action" }],
    ["git config --global alias ga 'git action'"]));

  test('Git Clone', () => run(
    [{ type: "GitClone", uri: "http://url.git" }],
    ["git clone http://url.git"]));

  test('Git Clone to target', () => run(
    [{ type: "GitClone", uri: "http://url-target.git", output_dir: "/user/home/two-x" }],
    ["git clone http://url-target.git /user/home/two-x"]
  ));

  test('Git Clone with args to target ', () => run(
    [{ type: "GitClone", uri: "http://url-target-args.git", output_dir: "/user/home/two-x", args: "--depth=1" }],
    ["git clone http://url-target-args.git /user/home/two-x --depth=1"]
  ));

  test('Git Clone with args', () => run(
    [{ type: "GitClone", uri: "http://url-target-args.git", args: "--depth=1" }],
    ["git clone http://url-target-args.git --depth=1"]
  ));

  test('Curl', () => run(
    [{ type: "Curl", uri: "http://url.git" }],
    ["curl http://url.git"]
  ));

  test('Curl with args', () => run(
    [{ type: "Curl", uri: "http://url-args.git", args: "-L" }],
    ["curl -L http://url-args.git"]
  ));

  test('Curl with args to target', () => run(
    [{ type: "Curl", uri: "http://url-args-target.git", args: "-L", target: { operator: "Pipe", path: "sh" } }],
    ["curl -L http://url-args-target.git | sh"]
  ));

  test('Curl to target', () => run(
    [{ type: "Curl", uri: "http://url-target.git", target: { operator: "Pipe", path: "sh" } }],
    ["curl http://url-target.git | sh"]
  ));

  test('File', () => run(
    [{ type: "File", content: "some content for a file", target: { operator: 'Redirect', path: "~/.ghci" } }],
    ["echo 'some content for a file' > ~/.ghci"]));
});

describe('Given a package request when scripted', () => {

  test('vscode-package returns code items with ext name', () => {
    let items = [
      {extension_name:"one"},
      {extension_name:"two"},
      {extension_name:"three"}
    ];
    let expected = [
      {type:'code', extension_name:"one"},
      {type:'code', extension_name:"two"},
      {type:'code', extension_name:"three"}
    ]
    let actual = tokenize({type: "vscode-package", extensions:items});

    expect(actual).toEqual(expected);
  });

  test('fish-package returns file items with serialized body', () => {
    let items = [
      {function_name:"one", function_body:"body body"},
      {function_name:"two", function_body:"body body body body"},
      {function_name:"three", function_body:"body body body body body body"}
    ];
    let expected = [
      {type:'file', content:"function one\n  body body\nend", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function two\n  body body body body\nend", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function three\n  body body body body body body\nend", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}}
    ]
    let actual = tokenize({type: "fish-package", functions: items, target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}});

    expect(actual).toEqual(expected);
  });

  test('bash-package returns file items with serialized body', () => {
    let items = [
      {function_name:"one", function_body:"body body"},
      {function_name:"two", function_body:"body body body body"},
      {function_name:"three", function_body:"body body body body body body"}
    ];
    let expected = [
      {type:'file', content:"function one(){\n  body body\n}", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function two(){\n  body body body body\n}", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function three(){\n  body body body body body body\n}", target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}}
    ]
    let actual = tokenize({type: "bash-package", functions: items, target:{operator:"RedirectAppend", path:"/user/home/.fish_git_aliases"}});

    expect(actual).toEqual(expected);
  });

  test('gitconfig-package returns git config items with target', () => {
    let items = [
      {name:"one", value:"body body"},
      {name:"two", value:"body body body body"},
      {name:"three", value:"body body body body body body"}
    ];
    let expected = [
      {type:'gitconfig', name:"one", value:"body body"},
      {type:'gitconfig', name:"two", value:"body body body body"},
      {type:'gitconfig', name:"three", value:"body body body body body body"}
    ]
    let actual = tokenize({type: "gitconfig-package", globals: items});

    expect(actual).toEqual(expected);
  });

});

describe('Given a Fish Shell Function when scripted', () => {

  test('Then all ${@} are replaced with $argv', () => {
    let actual = tokenize({type: "fish", function_name:"myfunction", function_body:"somestuff with ${@}"});
    let expected = {type: "file", content:"function myfunction\n  somestuff with $argv\nend"};
    expect(actual).toEqual(expected);
  });

  test('Then all ${#} are replaced with $argv[#]', () => {
    let actual = tokenize({type: "fish", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
    let expected = {type: "file", content:"function myfunction\n  somestuff with $argv[1] $argv[2] $argv[999]\nend"};
    expect(actual).toEqual(expected);
  });
});
