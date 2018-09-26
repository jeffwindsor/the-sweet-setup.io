const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');

// Functio to convert, modify and populate types
function expand(f){
  switch (f.type) {
    case 'BashFunction': 
      return { 
        type:'WriteToFile', 
        name:f.name, 
        value: joinNewLine(`function ${f.name}(){`, f.value, `}`),
        target: {
          operator: f.target.operator,
          path: f.target.path
        }
      }

    case 'FishFunction': 
      return { 
        type:'WriteToFile', 
        name:f.name, 
        value: joinNewLine(`function ${f.name}`, f.value, `end`),
        target: {
          operator: f.target.operator,
          path: `${f.target.path}/${f.name}.fish`
        }
      }

    case 'Script':
      //recusively process all items in the named list of fragments
      return _flatMap(readScriptFile(f), expand); 
      
    default: 
      return f;
  }
}
function joinNewLine(...fragments)     { return _join(fragments, '\n'); }
function readScriptFile(f){
  switch (f.name) {
    case 'BashGitAliases':  return convertGitAliases("BashFunction", f);
    case 'FishGitAliases':  return convertGitAliases("FishFunction", f);
    default:                return require(`./${f.name.toLowerCase()}.json`);
  }
}
function convertGitAliases(type, o){
  let gas = require('./gitaliases.json');
  return gas.map(f => { 
    return { 
      type:type, 
      name:"g" + f.name, 
      value:"git " + f.value, 
      target: { 
        operator: o.target.operator, 
        path: o.target.path 
      }
    }
  });
}

export { expand } 