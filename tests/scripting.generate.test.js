//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const rewire = require('rewire');
const scripting_module = rewire("../src/scripting.js");
//=================================================
const _ = require('lodash');
scripting_module.__set__("_", _);
//=================================================
const generate = scripting_module.__get__('generate');
//=================================================

describe('Scripting JS', () => {
  describe('Generate', () => {

    function run(token, expected) { expect(generate(token)).toEqual(expected); }

    test('Comment gives a # comment', () => run(
      { comment: "comment" },"#comment"));

    test('Echo gives a message', () => run(
      { echo: "Test Section" },"echo 'Test Section'"));

    test('Variable gives a name=value', () => run(
      { variable: "name", value: "value" },"name=value"));

    test('Arch Package gives a pacman call', () => run(
      { pacman: "arch" },"sudo pacman -S --noconfirm arch"));

    test('Yay Package gives a yay call', () => run(
      {  yay: "aur" },"yay -S --noconfirm aur"));

    test('Brew Package', () => run(
      { brew: "package-name" },"brew install package-name"));

    test('Cask Package', () => run(
      { cask: "cask" },"brew cask install cask"));

    test('Npm Package', () => run(
      { npm: "npm" },"npm install npm"));

    test('VS code install extension', () => run(
      { codeext: "vsc" },"code --install-extension vsc"));

    test('Haskell Stack Install', () => run(
      { stack: "package" },"stack install package"));

    test('File', () => run(
      { file: "some content for a file",
      target: { operator: 'Redirect', path: "~/.ghci" } },
      "echo 'some content for a file' > ~/.ghci"));

    test('git config global', () => run(
      { gitconfig: "alias ga", value: "git action" },"git config --global alias ga 'git action'"));

    test('Git Clone', () => run(
      { gitclone: "http://url.git" },"git clone http://url.git"));

    test('Git Clone to target', () => run(
      { gitclone: "http://url-target.git", output_dir: "/user/home/two-x" },"git clone http://url-target.git /user/home/two-x"
    ));

    test('Git Clone with args to target ', () => run(
      { gitclone: "http://url-target-args.git", output_dir: "/user/home/two-x", args: "--depth=1" },"git clone http://url-target-args.git /user/home/two-x --depth=1"
    ));

    test('Git Clone with args', () => run(
      { gitclone: "http://url-target-args.git", args: "--depth=1" },
      "git clone http://url-target-args.git --depth=1"
    ));

    describe('Curl', ()=>{
      test('Curl', () => run(
        { curl: "http://url.git" },
        "curl http://url.git"
      ));

      test('Curl with args', () => run(
        { curl: "http://url-args.git", args: "-L" },
        "curl -L http://url-args.git"
      ));

      test('Curl with args to target', () => run(
        { curl: "http://url-args-target.git", args: "-L", target: { operator: "Pipe", path: "sh" } },
        "curl -L http://url-args-target.git | sh"
      ));

      test('Curl to target', () => run(
        { curl: "http://url-target.git", target: { operator: "Pipe", path: "sh" } },
        "curl http://url-target.git | sh"
      ));
    });

  });
});