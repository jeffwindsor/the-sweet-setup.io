const _has = require('lodash/has');
const _join = require('lodash/join');
 
function expand(f){
  switch (f.type) {
    case 'BashFunction': 
      //exand to function write to file
      f.type='WriteToFile';
      f.value= joinNewLine(`function ${f.name}(){`, f.value, `}`);
      return f;
    case 'FishFunction': 
      //exand to function write to file
      f.type='WriteToFile';
      f.value= joinNewLine(`function ${f.name}`, f.value, `end`);
      return f;
    case 'ScriptPackage':
      if(_has(packages, f.name)){ return packages[f.name]; }
    default: 
      return f;
  }
}
function joinNewLine(...fragments)     { return _join(fragments, '\n'); }

const packages = {
  GitAliases: [
    {type:'GitGlobal', name:"s", value:"status -sb --ignore-submodules"},
    {type:'GitGlobal', name:"d", value:"diff"},
    {type:'GitGlobal', name:"aa", value:"add --all"},
    {type:'GitGlobal', name:"cm", value:"commit -m"},
    {type:'GitGlobal', name:"cma", value:"commit -a -m"},
    {type:'GitGlobal', name:"b", value:"branch"},
    {type:'GitGlobal', name:"co", value:"checkout"},
    {type:'GitGlobal', name:"cob", value:"checkout -b"},
    {type:'GitGlobal', name:"pff", value:"pull --ff-only"},
    {type:'GitGlobal', name:"mff", value:"merge --ff-only"},
    {type:'GitGlobal', name:"size", value:"count-objects -vH"},
    {type:'GitGlobal', name:"remove", value:"rm -r --cached ."},
    {type:'GitGlobal', name:"hist", value:"log --graph --max-count=100 --pretty=format:\\\"%C(green)%h%C(reset) | %C(yellow)%d%C(reset) %s %C(cyan)%an : %C(dim)%cr%C(reset)\\\" --abbrev-commit"}
  ]
}

export { expand } 