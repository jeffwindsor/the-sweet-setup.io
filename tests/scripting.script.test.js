//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const _ = require('lodash');
const rewire = require('rewire');
const scripting = rewire("../src/scripting.js");
const script = scripting.__get__('script');
scripting.__set__("_", _);
//=================================================

describe('Script for MacOS running Shell', () => {

  function run(request, generate_expected) {
    let actual = script('MacOs', 'Shell', request);
    let expected = ["#!/bin/sh"].concat(generate_expected); //append header for shell
    expect(actual).toEqual(expected);
  }

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
