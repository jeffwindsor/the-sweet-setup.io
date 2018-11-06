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

    describe('Header', () => {
      test('is a comment of bash script sha-bang', () => {
          let actual = tokenize({ header: "" });
          let expected = {comment:"!/bin/sh"};
          expect(actual).toEqual(expected);
      });
    });

    describe('Fish Function', () => {
      test('file type with content in fish function body outputted to fish function in config', () => {
        let actual = tokenize({fishfunction:"myfunction", function_body:"somestuff"});
        let expected = {file:"function myfunction\n  somestuff\nend", "target": {"operator": "redirect", "path": "~/.config/fish/functions/myfunction.fish"}};
        expect(actual).toEqual(expected);
      });

      test('target is transferred if given', () => {
        let actual = tokenize({fishfunction:"myfunction", function_body:"somestuff", target:{other:"something"} });
        let expected = {file:"function myfunction\n  somestuff\nend", target: {other:"something"}};
        expect(actual).toEqual(expected);
      });

      test('target is copied by value not by reference', () => {
        let original = {fishfunction:"myfunction", function_body:"somestuff", target:{other:"something"} };
        let actual = tokenize(original);
        original.target.other = "something_else";
        expect(actual.target.other).toEqual("something");
      });

      test('args are $argv', () => {
        let actual = tokenize({fishfunction:"myfunction", function_body:"somestuff with ${@}"});
        expect(actual.file).toContain("$argv");
      });

      test('numbered args $argv[#]', () => {
        let actual = tokenize({fishfunction:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
        expect(actual.file).toContain("$argv[1]");
        expect(actual.file).toContain("$argv[2]");
        expect(actual.file).toContain("$argv[999]");
      });
    });

    describe('Bash Function', () => {
      test('transformed to file type with content in bash function body appeneded to bashrc', () => {
        let actual = tokenize({bashfunction:"myfunction", function_body:"somestuff"});
        let expected = {file:"function myfunction(){\n  somestuff\n}", "target": {"operator": "redirectappend", "path": "~/.bashrc"}};
        expect(actual).toEqual(expected);
      });

      test('target is transferred if given', () => {
        let actual = tokenize({bashfunction:"myfunction", function_body:"somestuff", target:{other:"something"} });
        let expected = {file:"function myfunction(){\n  somestuff\n}", target: {other:"something"}};
        expect(actual).toEqual(expected);
      });

      test('target is copied, not by reference', () => {
        let original = {bashfunction:"myfunction", function_body:"somestuff", target:{other:"something"} };
        let actual = tokenize(original);
        original.target.other = "something_else";
        expect(actual.target.other).toEqual("something");
      });

      test('args are ${@}', () => {
        let actual = tokenize({bashfunction:"myfunction", function_body:"somestuff with ${@}"});
        expect(actual.file).toContain("${@}");
      });

      test('all numbered are ${#}', () => {
        let actual = tokenize({bashfunction:"myfunction", function_body:"somestuff with ${1} ${2} ${999}"});
        expect(actual.file).toContain("${1}");
        expect(actual.file).toContain("${2}");
        expect(actual.file).toContain("${999}");
      });
    });

  });
});





