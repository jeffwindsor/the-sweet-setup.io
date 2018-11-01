// //=================================================
// //REWIRE PAGE JS TO ACT LIKE NODE MODULE
// const rewire = require('rewire');
// const index = rewire("../src/index.js");

// const _ = require('lodash');
// index.__set__("_", _);

// const resetSourceTarget = index.__get__('resetSourceTarget');
// //=================================================


// describe('Reset', () => {
//   test('clears the text of #source and #target', () => {
//     document.body.innerHTML = 
//     '<div>' +
//     '  <textarea id="source">text text</textarea>' +
//     '  <textarea id="target">text text</textarea>' +
//     '</div>';
//     resetSourceTarget(document);
//     expect(document.getElementById('source').value).toEqual("");
//     expect(document.getElementById('target').value).toEqual("");
//   });
// });