const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');

function expand(f){
  switch (f.type) {
    case 'BashFunction': 
      //function => write to file
      f.type='WriteToFile';
      f.value= joinNewLine(`function ${f.name}(){`, f.value, `}`);
      return f;

    case 'FishFunction': 
      //function => write to file
      f.type='WriteToFile';
      f.value= joinNewLine(`function ${f.name}`, f.value, `end`);
      return f;

    case 'Script':
      //recusively process all items in the named list of fragments
      return _flatMap(readScriptFile(f.name), expand); 
      
    default: 
      return f;
  }
}
function joinNewLine(...fragments)     { return _join(fragments, '\n'); }
function readScriptFile(name){
  switch (name) {
    case 'BashGitAliases':  return convertGitAliases("BashFunction");
    case 'FishGitAliases':  return convertGitAliases("FishFunction");
    default:                return require(`./${name.toLowerCase()}.json`);
  }
}
function convertGitAliases(type){
  let gas = require('./gitaliases.json');
  return gas.map(f => { 
    return {type:type, name:"g" + f.name, value:"git " + f.value }
  });
}

export { expand } 