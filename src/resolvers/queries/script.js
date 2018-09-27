import { traverse } from './traverse';
const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');
const _filter = require('lodash/filter');

function script(shell, fragments){
  let fs = [scriptShell(shell)].concat(fragments)
  return _flatMap(fs, traverse).map(generate);
}
function scriptShell(shell){
  return {type:'Comment', name:'!/bin/sh'}
}
function generate(f){
  switch (f.type) {
    case 'Comment':              return `#${f.name}`;
    case 'Info':                 return `echo -e '==> ${f.name}'`;
    case 'Variable':             return joinEqualed(f.name, f.value)
    case 'ArchPackage':          return joinSpace('sudo pacman','-S --noconfirm', f.name);
    case 'YayPackage':           return joinSpace('yay', '-S --noconfirm', f.name);
    case 'BrewPackage':          return joinSpace('brew install', f.name);
    case 'CaskPackage':          return joinSpace('brew cask install', f.name);
    case 'NpmPackage':           return joinSpace('npm install', f.name);
    case 'VsCodeExtension':      return joinSpace('code', '--install-extension', f.name);
    case 'HaskellStackInstall':  return joinSpace('stack install', f.name);
    case 'WriteToFile':          return joinSpace('echo -e',`'${f.value}'`, getTargetOperator(f.target), getTargetPath(f.target));
    case 'GitGlobal':            return joinSpace('git config', '--global', f.name, `'${f.value}'`);
    case 'GitClone':             return joinSpace('git clone', f.name, getTargetPath(f.target), f.args);
    case 'Curl':                 return joinSpace('curl', f.args, f.name, getTargetOperator(f.target), getTargetPath(f.target));
    default: return "";
 }
}
function joinSpace(...fragments)  { return joinNotNull(fragments, ' '); }
function joinEqualed(...fragments){ return joinNotNull(fragments, '='); }
function joinNotNull(xs, sep)     { return _join(_filter(xs, (f) => f != null), sep); }

function getTargetPath(target)    { return (target == null) ? null : target.path; }
function getTargetOperator(target){ return (target == null) ? null : targetOperatorResolver(target.operator); }
function targetOperatorResolver(operator){
  switch (operator) {
    case "None" : return ""
    case "Pipe": return "|"
    case "RedirectOutput": return ">"
    case "RedirectOutputAppend": return ">>"
    default: return "???"
  }
}

export {script}