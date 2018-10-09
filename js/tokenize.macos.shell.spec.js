import { tokenize } from './scripting'

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
      {type:'file', content:"function one\nbody body\nend", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function two\nbody body body body\nend", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function three\nbody body body body body body\nend", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}}
    ]
    let actual = tokenize({type: "fish-package", functions: items, target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}});

    expect(actual).toEqual(expected);
  });

  test('bash-package returns file items with serialized body', () => {
    let items = [
      {function_name:"one", function_body:"body body"},
      {function_name:"two", function_body:"body body body body"},
      {function_name:"three", function_body:"body body body body body body"}
    ];
    let expected = [
      {type:'file', content:"function one(){\nbody body\n}", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function two(){\nbody body body body\n}", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}},
      {type:'file', content:"function three(){\nbody body body body body body\n}", target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}}
    ]
    let actual = tokenize({type: "bash-package", functions: items, target:{operator:"RedirectOutputAppend", path:"/user/home/.fish_git_aliases"}});

    expect(actual).toEqual(expected);
  });

  test('gitconfig-package returns git config items with target', () => {
    let items = [
      {name:"one", value:"body body"},
      {name:"two", value:"body body body body"},
      {name:"three", value:"body body body body body body"}
    ];
    let expected = [
      {type:'gitconfig', name:"one", value:"body body", target:{operator:"RedirectOutput", path:"/user/home/.git_aliases"}},
      {type:'gitconfig', name:"two", value:"body body body body", target:{operator:"RedirectOutput", path:"/user/home/.git_aliases"}},
      {type:'gitconfig', name:"three", value:"body body body body body body", target:{operator:"RedirectOutput", path:"/user/home/.git_aliases"}}
    ]
    let actual = tokenize({type: "gitconfig-package", globals: items, target:{operator:"RedirectOutput", path:"/user/home/.git_aliases"}});

    expect(actual).toEqual(expected);
  });

});

describe('Given a Fish Shell Function when scripted', () => {

  test('Then all ${@} are replaced with $argv', () => {
    let actual = tokenize({type: "fish", function_name:"myfunction", function_body:"somestuff with ${@}"});
    let expected = {type: "file", content:"function myfunction\nsomestuff with $argv\nend"};
    expect(actual).toEqual(expected);
  });

  test('Then all ${#} are replaced with $argv[#]', () => {
    let actual = tokenize({type: "fish", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
    let expected = {type: "file", content:"function myfunction\nsomestuff with $argv[1] $argv[2] $argv[999]\nend"};
    expect(actual).toEqual(expected);
  });
});
