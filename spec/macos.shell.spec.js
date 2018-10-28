//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const _ = require('lodash');
const rewire = require('rewire');
const scripting = rewire("../src/scripting.js");
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

describe('Given a scriptlet (defined by a type which is plural)', () => {

  test('each item has all properties transfered', () => {
    let items = [
      {name:"one", other:"1"},
      {name:"two", other:"2"},
      {name:"three", other:"3"}
    ];     
    let expected = [
      {type:"", name:"one", other:"1"},
      {type:"", name:"two", other:"2"},
      {type:"", name:"three", other:"3"}
    ]
    let actual = tokenize({type: "s", items:items});
    expect(actual).toEqual(expected);
  });

  test('each item has a type equal to singular version of type', () => {
    let expected = [ {type:"fake"}, {type:"fake"}, {type:"fake"} ];
    let actual = tokenize({type: "fakes", items:[ {}, {}, {} ]});
    expect(actual).toEqual(expected);
  });
  
  test('target is copied if present', () => {
    let expected = [ {type: "", target:{ prop:"something"}}, {type: "", target:{ prop:"something"}}, {type: "", target:{ prop:"something"}} ]
    let actual = tokenize({type: "s", target:{ prop:"something"}, items:[ {}, {}, {} ]});
    expect(actual).toEqual(expected);
  });

  test('target is copied not assigned by reference', () => {
    let expected = [ {type: "", target:{ prop:"something"}}, {type: "", target:{ prop:"something"}} ]
    let actual = tokenize({type: "s", target:{ prop:"something"}, items:[ {}, {} ]});
    actual[0].target.prop="something_else";

    expect(actual[0].target.prop).toEqual("something_else");
    expect(actual[1].target.prop).toEqual("something");
  });

  test('transformation is recursive ensuring procesing to base type', () => {
    //known single is further transformed to is mosst base level, header -> comment
    let expected = [ {type:"comment", comment: "!/bin/sh"}, {type:"comment", comment: "!/bin/sh"} ];
    let actual = tokenize({type: "headers", items:[ {}, {} ]});
    expect(actual).toEqual(expected);
  });

});

describe('Header scripting', () => {
  test('transformed into comment of bash script sha-bang', () => run(
      [{ type: "Header" }],
      ["#!/bin/sh"]  
    ));
  });

describe('Fish Function scripting', () => {
  test('transformed to file type with content in fish function body outputted to fish function in config', () => {
    let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff"});
    let expected = {type: "file", content:"function myfunction\n  somestuff\nend", "target": {"operator": "redirect", "path": "~/.config/fish/functions/myfunction.fish"}};
    expect(actual).toEqual(expected);
  });

  test('target is transferred if given', () => {
    let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} });
    let expected = {type: "file", content:"function myfunction\n  somestuff\nend", target: {other:"something"}};
    expect(actual).toEqual(expected);
  });

  test('target is copied, not by reference', () => {
    let original = {type: "fish-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} };
    let actual = tokenize(original);
    original.target.other = "something_else";
    expect(actual.target.other).toEqual("something");
  });
  
  test('args are $argv', () => {
    let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff with ${@}"});
    expect(actual.content).toContain("$argv");
  });

  test('numbered args $argv[#]', () => {
    let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
    expect(actual.content).toContain("$argv[1]");
    expect(actual.content).toContain("$argv[2]");
    expect(actual.content).toContain("$argv[999]");
  });
});

describe('Bash Function scripting', () => {
  test('transformed to file type with content in bash function body appeneded to bashrc', () => {
    let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff"});
    let expected = {type: "file", content:"function myfunction(){\n  somestuff\n}", "target": {"operator": "redirectappend", "path": "~/.bashrc"}};
    expect(actual).toEqual(expected);
  });

  test('target is transferred if given', () => {
    let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} });
    let expected = {type: "file", content:"function myfunction(){\n  somestuff\n}", target: {other:"something"}};
    expect(actual).toEqual(expected);
  });

  test('target is copied, not by reference', () => {
    let original = {type: "bash-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} };
    let actual = tokenize(original);
    original.target.other = "something_else";
    expect(actual.target.other).toEqual("something");
  });
  
  test('args are ${@}', () => {
    let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff with ${@}"});
    expect(actual.content).toContain("${@}");
  });

  test('all numbered are ${#}', () => {
    let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
    expect(actual.content).toContain("${1}");
    expect(actual.content).toContain("${2}");
    expect(actual.content).toContain("${999}");
  });
});
