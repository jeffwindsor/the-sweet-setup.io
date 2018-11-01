//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const _ = require('lodash');
const rewire = require('rewire');
const scripting = rewire("../src/scripting.js");
const tokenize = scripting.__get__('tokenize');
scripting.__set__("_", _);
//=================================================

describe('Tokenize', () => {
  describe('Group Type', () => {

    it('each item has all properties transferred', () => {
      let actual = tokenize({type: "group", itemType:"", items:[
        {name:"one", other:"1"},
        {name:"two", other:"2"},
        {name:"three", other:"3"}
      ]});

      let expected = [
        {type:"", name:"one", other:"1"},
        {type:"", name:"two", other:"2"},
        {type:"", name:"three", other:"3"}
      ]

      expect(actual).toEqual(expected);
    });

    it('each item has type set to groups item type', () => {
      let actual = tokenize({type: "group", itemType:"fake", items:[ {}, {}, {} ]});
      let expected = [ {type:"fake"}, {type:"fake"}, {type:"fake"} ];
      expect(actual).toEqual(expected);
    });

    it('each item gets group target', () => {
      let actual = tokenize({type: "group", itemType:"fake", target:{ prop:"something"},
        items:[ {}, {}]
      });
      let expected = [
        {type:"fake", target:{ prop:"something"}},
        {type: "fake", target:{ prop:"something"}}
      ]
      expect(actual).toEqual(expected);
    });

    it('group target is copied by value not reference', () => {
      let actual = tokenize({type: "group", itemType:"", target:{ prop:"something"}, items:[ {}, {} ]});
      actual[0].target.prop="something_else";
      expect(actual[0].target.prop).toEqual("something_else");
      expect(actual[1].target.prop).toEqual("something");
    });

    it('item tokenization is recursive, ensuring a generate-able token', () => {
      let actual = tokenize({type: "headers",
        items:[ {}, {} ]
      });
      let expected = [
        {type:"comment", comment: "!/bin/sh"},
        {type:"comment", comment: "!/bin/sh"}
      ];
      expect(actual).toEqual(expected);
    });

  });

  // describe('Tokenize Header', () => {
  //   it('transformed into comment of bash script sha-bang', () => {
  //       let actual = tokenize({ type: "Header" });
  //       let expected = {type:"comment", comment:"!/bin/sh"};
  //       expect(actual).toEqual(expected);
  //   });
  // });

  // describe('Tokenize Fish Function', () => {
  //   it('transformed to file type with content in fish function body outputted to fish function in config', () => {
  //     let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff"});
  //     let expected = {type: "file", content:"function myfunction\n  somestuff\nend", "target": {"operator": "redirect", "path": "~/.config/fish/functions/myfunction.fish"}};
  //     expect(actual).toEqual(expected);
  //   });

  //   it('target is transferred if given', () => {
  //     let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} });
  //     let expected = {type: "file", content:"function myfunction\n  somestuff\nend", target: {other:"something"}};
  //     expect(actual).toEqual(expected);
  //   });

  //   it('target is copied, not by reference', () => {
  //     let original = {type: "fish-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} };
  //     let actual = tokenize(original);
  //     original.target.other = "something_else";
  //     expect(actual.target.other).toEqual("something");
  //   });

  //   it('args are $argv', () => {
  //     let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff with ${@}"});
  //     expect(actual.content).toContain("$argv");
  //   });

  //   it('numbered args $argv[#]', () => {
  //     let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
  //     expect(actual.content).toContain("$argv[1]");
  //     expect(actual.content).toContain("$argv[2]");
  //     expect(actual.content).toContain("$argv[999]");
  //   });
  // });

  // describe('Tokenize Bash Function', () => {
  //   it('transformed to file type with content in bash function body appeneded to bashrc', () => {
  //     let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff"});
  //     let expected = {type: "file", content:"function myfunction(){\n  somestuff\n}", "target": {"operator": "redirectappend", "path": "~/.bashrc"}};
  //     expect(actual).toEqual(expected);
  //   });

  //   it('target is transferred if given', () => {
  //     let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} });
  //     let expected = {type: "file", content:"function myfunction(){\n  somestuff\n}", target: {other:"something"}};
  //     expect(actual).toEqual(expected);
  //   });

  //   it('target is copied, not by reference', () => {
  //     let original = {type: "bash-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} };
  //     let actual = tokenize(original);
  //     original.target.other = "something_else";
  //     expect(actual.target.other).toEqual("something");
  //   });

  //   it('args are ${@}', () => {
  //     let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff with ${@}"});
  //     expect(actual.content).toContain("${@}");
  //   });

  //   it('all numbered are ${#}', () => {
  //     let actual = tokenize({type: "bash-function", function_name:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
  //     expect(actual.content).toContain("${1}");
  //     expect(actual.content).toContain("${2}");
  //     expect(actual.content).toContain("${999}");
  //   });
  // });

  // describe('Tokenize VSCode Extensions', () => {
  //   it('transformed to code type with extension', () => {
  //     let actual = tokenize({type: "vscode-extension", extension_name:"somestuff"});
  //     let expected = {type: "code", extension_name:"somestuff"};
  //     expect(actual).toEqual(expected);
  //   });
  // });

});