import { tokenize } from './tokenize'

function tokenizeIsExpected(request, expected){
  expect(tokenize(request)).toEqual(expected);
}
function tokenizeExpansionAllAsExpected(request, assert){
  tokenize(request).forEach(assert);
}

describe('Given a Fish Shell Function when scripted', () => {

  test('Then all ${@} are replaced with $argv', () => tokenizeIsExpected(
    {type: "FishFunction", name:"myfunction", value:"somestuff with ${@}"},
    {type: "WriteToFile", name:"myfunction", value:"function myfunction\nsomestuff with $argv\nend"}
    ));

  test('Then all ${#} are replaced with $argv[#]', () => tokenizeIsExpected(
    {type: "FishFunction", name:"myfunction", value:"somestuff with ${1} ${2} ${999}"},
    {type: "WriteToFile", name:"myfunction", value:"function myfunction\nsomestuff with $argv[1] $argv[2] $argv[999]\nend"}
    ));

});

describe('Given a transformable request for MacOS and SH when scripted', () => {
  //ScriptPackage

  test('Header are tokenized properly', () => tokenizeIsExpected(
    {type: "Header",  os:'MacOs', language:'Shell'},
    {type: "Comment", name:"!/bin/sh"}
    ));

  test('WritePackageToFile serializes package into value string', () => tokenizeIsExpected(
    {type: "WritePackageToFile", name:"vscode-settings", target:{operator:'RedirectOutput', path:"/user/home/.vscode-settings"}},
    { type: "WriteToFile",
      name:"vscode-settings",
      value: `{"javascript.updateImportsOnFileMove.enabled":"always","jest.showCoverageOnLoad":true,"breadcrumbs.enabled":true,"editor.tabSize":2,"editor.detectIndentation":false,"editor.renderWhitespace":"all","editor.renderControlCharacters":true,"editor.fontSize":14,"editor.fontFamily":"'Noto Mono for Powerline', 'Courier New', monospace","explorer.confirmDelete":false,"explorer.confirmDragAndDrop":false,"files.autoSave":"onFocusChange","files.trimTrailingWhitespace":true,"workbench.colorTheme":"Better Solarized Dark","window.zoomLevel":1,"haskell.indentationRules.enabled":false,"gitlens.advanced.messages":{"suppressFileNotUnderSourceControlWarning":true,"suppressShowKeyBindingsNotice":true},"workbench.iconTheme":"material-icon-theme","explorer.openEditors.visible":0}`,
      target:{operator:'RedirectOutput', path:"/user/home/.vscode-settings"
    }
  }
    ));

  test('BashFunctions are tokenized properly', () => tokenizeIsExpected(
    {type:"BashFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}},
    {type:"WriteToFile", name:"myfunction", value:"function myfunction(){\nsomestuff\n}", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}}
    ));

  test('FishFunction are tokenized properly', () => tokenizeIsExpected(
    {type:"FishFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}},
    {type: "WriteToFile", name:"myfunction", value:"function myfunction\nsomestuff\nend", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}}
    ));

  test('GitAliasPackage has type of git global', () => tokenizeExpansionAllAsExpected(
    {type: "GitAliasPackage", name:"gitglobal"},
    t => expect(t.type).toEqual('GitGlobal')
    ));

  test('FunctionPackageAsBash has type of BashFunction and transfers target', () => tokenizeExpansionAllAsExpected(
    {type: "FunctionPackageAsBash", name:"git-alias", target:{operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"}},
    t => {
      expect(t.type).toEqual('BashFunction');
      expect(t.target).toEqual({operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"});
    }
    ));

  test('FunctionPackageAsFish has type of FishFunction and transfers target', () => tokenizeExpansionAllAsExpected(
    {type: "FunctionPackageAsFish", name:"git-alias", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
    t => {
      expect(t.type).toEqual('FishFunction');
      expect(t.target).toEqual({operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"});
    }
    ));

  test('VSCodeExtensionPackage has type of VsCodeExtension and does not transfer target or value', () => tokenizeExpansionAllAsExpected(
    {type: "VSCodeExtensionPackage", name:"vscode-extensions", target:{operator:"RedirectOutput", path:"/user/home/.vscode-extions"}},
    t => {
      expect(t.type).toEqual('VsCodeExtension');
      expect(t.target).toEqual(undefined);
      expect(t.value).toEqual(undefined);
    }
    ));

    test('ScriptPackage loads all tokens in package and all convert-able packages', () => false);
  });