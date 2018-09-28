const _join = require('lodash/join');
const _filter = require('lodash/filter');

function generate(os, language, token){
  switch(language){
    case 'Shell': return generateShell(token);
    default:      return `language ${language} unknown`;
  }
}

function generateShell(token){
  switch (token.type) {
    case 'Comment':              return `#${token.name}`;
    case 'Info':                 return `echo -e '==> ${token.name}'`;
    case 'Variable':             return joinEqualed(token.name, token.value)
    case 'ArchPackage':          return joinSpace('sudo pacman','-S --noconfirm', token.name);
    case 'YayPackage':           return joinSpace('yay', '-S --noconfirm', token.name);
    case 'BrewPackage':          return joinSpace('brew install', token.name);
    case 'CaskPackage':          return joinSpace('brew cask install', token.name);
    case 'NpmPackage':           return joinSpace('npm install', token.name);
    case 'VsCodeExtension':      return joinSpace('code', '--install-extension', token.name);
    case 'HaskellStackInstall':  return joinSpace('stack install', token.name);
    case 'WriteToFile':          return joinSpace('echo -e',`'${token.value}'`, getTargetOperator(token.target), getTargetPath(token.target));
    case 'GitGlobal':            return joinSpace('git config', '--global', token.name, `'${token.value}'`);
    case 'GitClone':             return joinSpace('git clone', token.name, getTargetPath(token.target), token.args);
    case 'Curl':                 return joinSpace('curl', token.args, token.name, getTargetOperator(token.target), getTargetPath(token.target));
    default: return "";
 }
}

function joinSpace(...xs)  { return joinNotNull(xs, ' '); }
function joinEqualed(...xs){ return joinNotNull(xs, '='); }
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

export { generate }