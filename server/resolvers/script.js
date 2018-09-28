import { tokenize, tokenizeShellHeader } from './tokenize';
import { generate } from './generate';
const _flatMap = require('lodash/flatMap');

export function script(addHeader=true, os, language, requests){
  //Add Header to list
  if(addHeader){
    let header = {type:"Header", os:os, language:language};
    let requests = (header)[header].concat(requests);
  }
  //Traverse and Transform List
  let tokens  = _flatMap(requests, request => tokenize(request));
  //Generate Script
  return tokens.map( token => generate(os, language, token) );
}

