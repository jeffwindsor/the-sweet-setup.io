import { tokenize } from './tokenize'

function run(request, expected){
  expect(tokenize(request)).toEqual(expected);
}
function runPackage(request, type){
  tokenize(request)
    .forEach(t => expect(t.type).toEqual(type));
}

describe('Given a transformable request for MacOS and SH when scripted', () => {
  //ScriptPackage

    test('Header are tokenized properly', () => run(
      {type: "Header",  os:'MacOs', language:'Shell'},
      {type: "Comment", name:"!/bin/sh"}
      ));

    test('BashFunctions are tokenized properly', () => run(
      {type: "BashFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}},
      {type: "WriteToFile", name:"myfunction", value:"function myfunction(){\nsomestuff\n}", target:{operator:'RedirectOutputAppend', path:"/user/home/.bashrc"}}
      ));
  
    test('FishFunction are tokenized properly', () => run(
      {type: "FishFunction", name:"myfunction", value:"somestuff", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}},
      {type: "WriteToFile", name:"myfunction", value:"function myfunction\nsomestuff\nend", target:{operator:'RedirectOutputAppend', path:"/user/home/.fishrc"}}
      ));
  
    test('GitAliasPackage returns multiple lines', () => runPackage(
      {type: "GitAliasPackage", name:"gitaliases"}, 
      'GitGlobal'));
  
    test('FunctionPackageAsBash returns multiple lines', () => runPackage(
      {type: "FunctionPackageAsBash", name:"gitaliases", target:{operator:"RedirectOutputAppend", path:"/user/home/.bash_git_aliases"}},
      'BashFunction'));
  
    test('FunctionPackageAsFish returns multiple lines', () => runPackage(
      {type: "FunctionPackageAsFish", name:"gitaliases", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
      'FishFunction'));
  });