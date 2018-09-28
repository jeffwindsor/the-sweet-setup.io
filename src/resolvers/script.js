import { traverse } from './scripts/traverse'
import { generate } from './scripts/generate';
const _flatMap = require('lodash/flatMap');

function script(os, language, tokens){
  let nodes = [{type:'ShellHeader', name:os, value:language}].concat(tokens);
  return _flatMap(nodes, traverse).map( token => generate(language,token));
}

export { script }