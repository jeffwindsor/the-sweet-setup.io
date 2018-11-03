//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const rewire = require('rewire');
const scripting_module = rewire("../src/scripting.js");
//=================================================
const _ = require('lodash');
scripting_module.__set__("_", _);
//=================================================
const tokenize = scripting_module.__get__('tokenize');
//=================================================

describe('Scripting', () => {
  describe('Tokenize', () => {
    describe('List', () => {
      test('items are extracted ', () => {

      });
    });

    describe('Group', () => {
      test('all item properties are copied', () => {
        let input = {type: "group", itemType:"", items:[
          {name:"one", other:"1"},
          {name:"two", other:"2"},
          {name:"three", other:"3"}
        ]};

        let actual = tokenize(input);

        let expected = [
          {type:"", name:"one", other:"1"},
          {type:"", name:"two", other:"2"},
          {type:"", name:"three", other:"3"}
        ];
        expect(actual).toEqual(expected);
      });

      test('each item has a type equal to singular version of type', () => {
        let input = {type: "group", itemType:"fake", items:[ {name:"one"}, {name:"two"} ]};

        let actual = tokenize(input);

        let expected = [ {type:"fake", name:"one"}, {type:"fake", name:"two"} ];
        expect(actual).toEqual(expected);
      });

      test('target is copied if present', () => {
        let input = {type: "group", itemType:"", target:{ prop:"something"}, items:[ {}, {} ]};

        let actual = tokenize(input);

        let expected = [ {type: "", target:{ prop:"something"}}, {type: "", target:{ prop:"something"}} ]
        expect(actual).toEqual(expected);
      });

      test('target is copied by value not by reference', () => {
        let input = {type: "group", itemType:"", target:{ prop:"something"}, items:[ {}, {} ]};

        let actual = tokenize(input);
        actual[0].target.prop="something_else";

        expect(actual[0].target.prop).toEqual("something_else");
        expect(actual[1].target.prop).toEqual("something");
      });

      test('transformation is recursive ensuring procesing to base type', () => {
        let input = {type:"group", itemType: "header", items:[ {}, {} ]};

        let actual = tokenize(input);

        //known single is further transformed to is mosst base level, header -> comment
        let expected = [ {type:"comment", comment: "!/bin/sh"}, {type:"comment", comment: "!/bin/sh"} ];
        expect(actual).toEqual(expected);
      });

    });

    describe('Header', () => {
      test('is a comment of bash script sha-bang', () => {
          let actual = tokenize({ type: "Header" });
          let expected = {type:"comment", comment:"!/bin/sh"};
          expect(actual).toEqual(expected);
      });
    });

    describe('Fish Function', () => {
      test('file type with content in fish function body outputted to fish function in config', () => {
        let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff"});
        let expected = {type: "file", content:"function myfunction\n  somestuff\nend", "target": {"operator": "redirect", "path": "~/.config/fish/functions/myfunction.fish"}};
        expect(actual).toEqual(expected);
      });

      test('target is transferred if given', () => {
        let actual = tokenize({type: "fish-function", function_name:"myfunction", function_body:"somestuff", target:{other:"something"} });
        let expected = {type: "file", content:"function myfunction\n  somestuff\nend", target: {other:"something"}};
        expect(actual).toEqual(expected);
      });

      test('target is copied by value not by reference', () => {
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

    describe('Bash Function', () => {
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

    describe('Tokenize VSCode Extensions', () => {
      test('transformed to code type with extension', () => {
        let actual = tokenize({type: "vscode-extension", extension_name:"somestuff"});
        let expected = {type: "code", extension_name:"somestuff"};
        expect(actual).toEqual(expected);
      });
    });

  });
});





