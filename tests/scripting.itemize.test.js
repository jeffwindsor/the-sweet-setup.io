//=================================================
//REWIRE PAGE JS TO ACT LIKE NODE MODULE
const rewire = require('rewire');
const scripting_module = rewire("../src/scripting.js");
//=================================================
const _ = require('lodash');
scripting_module.__set__("_", _);
//=================================================
const itemize = scripting_module.__get__('itemize');
//=================================================

describe('Scripting', () => {
  describe('Itemize', () => {
    describe('Group', () => {
    });
  });
});