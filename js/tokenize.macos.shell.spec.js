import { tokenize, tokenizePackage, loadPackage } from './scripting'

function tokenizeIsExpected(request, expected){
  expect(tokenize(request)).toEqual(expected);
}

describe('Given a Fish Shell Function when scripted', () => {

  test('Then all ${@} are replaced with $argv', () => tokenizeIsExpected(
    {type: "fish", name:"myfunction", value:"somestuff with ${@}"},
    {type: "writetofile", name:"myfunction", value:"function myfunction\nsomestuff with $argv\nend"}
    ));

  test('Then all ${#} are replaced with $argv[#]', () => tokenizeIsExpected(
    {type: "fish", name:"myfunction", value:"somestuff with ${1} ${2} ${999}"},
    {type: "writetofile", name:"myfunction", value:"function myfunction\nsomestuff with $argv[1] $argv[2] $argv[999]\nend"}
    ));

});

describe('Given a transformable request for MacOS and SH when scripted', () => {
  //ScriptPackage

  test('Headers are tokenized properly', () => tokenizeIsExpected(
    {type: "Header",  os:'MacOs', language:'Shell'},
    {type: "comment", name:"!/bin/sh"}
    ));

  test('Bash functions are tokenized properly', () => tokenizeIsExpected(
    {type:"bash", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}},
    {type:"writetofile", name:"myfunction", value:"function myfunction(){\nsomestuff\n}", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}}
    ));

  test('Fish function are tokenized properly', () => tokenizeIsExpected(
    {type:"fish", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}},
    {type: "writetofile", name:"myfunction", value:"function myfunction\nsomestuff\nend", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}}
    ));

  test('load packages', () => {
    let actual = loadPackage("gitglobal");
    expect(actual.length).toBeGreaterThan(0);
  });

  test('tokenize packages', () => {
    let actual = tokenizePackage("gitglobal", "gitglobal", null);
    expect(actual.length).toBeGreaterThan(0);
  });

  test('GitAliasPackage has type of git global', () => {
    let actuals = tokenize({type: "package", name:"gitglobal", value:"gitglobal"});
    actuals.forEach(t => expect(t.type).toEqual('gitconfigglobal'));
  });

  test('Package as fish function has type of writetofile and transfers target', () => {
    let actuals = tokenize({type: "package", name:"git-alias", value:"fish", target:{operator:"RedirectOutput", path:"/user/home/.fish_git_aliases"}});
    actuals.forEach(t =>
      expect(t.target).toEqual({operator:"RedirectOutput", path:"/user/home/.fish_git_aliases"})
    );
  });

  test('Package as bash functions has type of writetofile and transfers target', () => {
    let actuals = tokenize({type: "package", name:"git-alias", value:"bash", target:{operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"}});
    actuals.forEach(t =>
      expect(t.target).toEqual({operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"})
    );
  });

  test('VSCodeExtensionPackage has type of VsCodeExtension and does not transfer target or value', () => {
    let actuals = tokenize({type: "package", name:"vscode-extensions", value:"vscodeextension", target:{operator:"RedirectOutput", path:"/user/home/.vscode-extions"}});
    actuals.forEach(t => {
      expect(t.type).toEqual('codeinstallextension');
      expect(t.target).toEqual(undefined);
      expect(t.value).toEqual(undefined);
    });
  });

    // test('ScriptPackage loads all tokens in package and all convert-able packages', () => false);
});