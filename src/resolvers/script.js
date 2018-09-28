import { traverse } from './traverse';
import { generate } from './generate';
import { tokenizeShellHeader } from './tokenize'
const _flatMap = require('lodash/flatMap');

export function script(os, language, tokens){
  //Add Header to list
  let header = tokenizeShellHeader(os, language);
  let requestList = [header].concat(tokens);
  //Traverse and Transform List
  let scriptList  = _flatMap(requestList, token => traverse(os, language, token));
  //Generate Script
  return scriptList.map( token => generate(os, language, token) );
}

