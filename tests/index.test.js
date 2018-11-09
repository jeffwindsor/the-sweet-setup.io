//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const rewire = require('rewire');
const index_module = rewire("../src/index.js");
//=================================================
const _ = require('lodash');
index_module.__set__("_", _);
//=================================================

const removeTrailingComma = index_module.__get__('removeTrailingComma');
const jsonToObjectArray = index_module.__get__('jsonToObjectArray');
const wrapInBrackets = index_module.__get__('wrapInBrackets');
const replaceInContent = index_module.__get__('replaceInContent');

//=================================================

describe("Index", () => {
  describe("Json to Array", () => {
    it('converts JSON to an object array', () => {
      const actual = jsonToObjectArray('[{"one":"1","two":"2"}, {"three":"3","four":"4"}]');
      const expected = [{one:"1",two:"2"}, {three:"3",four:"4"}];
      expect(actual).toEqual(expected);
    });
    it('converts empty string to an empty object array', () => {
      const actual = jsonToObjectArray('');
      const expected = [];
      expect(actual).toEqual(expected);
    });
    it('wraps any free form JSON in an Array', () => {
      const actual = jsonToObjectArray('{"one":"1","two":"2"}, {"three":"3","four":"4"},');
      const expected = [{one:"1",two:"2"}, {three:"3",four:"4"}];
      expect(actual).toEqual(expected);
    });
    it('Json is trimmed and trailing commas removed', () => {
      const actual = jsonToObjectArray('    {"one":"1","two":"2"},     {"three":"3","four":"4"},   ');
      const expected = [{one:"1",two:"2"}, {three:"3",four:"4"}];
      expect(actual).toEqual(expected);
    });
  });

  describe("Merge Content", () => {
    it('', () => {});
  });
  describe("Replace in Content", () => {

    it('text is replaced', () => {
      const content = '[{},{},{"link":"http://somethinghere"},{},{}]';
      const replaceThis = '{"link":"http://somethinghere"}';
      const withThat = '{"comment":"this"}';

      const actual = replaceInContent(content, replaceThis, withThat);
      expect(actual).toEqual('[{},{},{"comment":"this"},{},{}]');
    });
  });
  describe("Object to JSON", () => {
    it('', () => {});
  });

  describe("Remove Trailing Comma", () => {
    it('Trailing comma is removed', () => {
      const actual = removeTrailingComma('This, is a, string, with commas in   and white space after it,');
      expect(actual).toBe('This, is a, string, with commas in   and white space after it');
    });
  });

  describe("Wrap in Brackets", () => {
    it('Wraps in [ ]', () => {
      const actual = wrapInBrackets("some[]text");
      expect(actual).toEqual("[some[]text]");
    });
    it('will recognize existing [ at front of string', () => {
      const actual = wrapInBrackets("[some[]text");
      expect(actual).toEqual("[some[]text]");
    });
    it('will recognize existing ] at end of string', () => {
      const actual = wrapInBrackets("some[]text]");
      expect(actual).toEqual("[some[]text]");
    });
  })

  // describe("Replace", () => {
  //   it('replace array item', () => {
  //       let replaceThis = { foo: "bar"};
  //       let withThat = {bar:"baz"};
  //       let target = [{one:"one"},{two:"two"},{foo: "bar"},{three:"three"}]

  //       let actual = replace(target,replaceThis,withThat);
  //       console.log(target[2]);
  //       console.log(replaceThis);
  //       expect(Object.is(target[2], replaceThis)).toBe(true);
  //       //expect(actual).toEqual([{one:"one"},{two:"two"},{bar: "baz"},{three:"three"}])
  //   });
  // });
});