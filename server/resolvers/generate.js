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
    case 'Variable':             return `${token.name}=${token.value}`
    case 'ArchPackage':          return `sudo pacman -S --noconfirm ${token.name}`;
    case 'YayPackage':           return `yay -S --noconfirm ${token.name}`;
    case 'BrewPackage':          return `brew install ${token.name}`;
    case 'CaskPackage':          return `brew cask install ${token.name}`;
    case 'NpmPackage':           return `npm install ${token.name}`;
    case 'VsCodeExtension':      return `code --install-extension ${token.name}`;
    case 'HaskellStackInstall':  return `stack install ${token.name}`;
    case 'WriteToFile':          return joinNotNull(`echo -e '${token.value}'`, getTargetOperator(token.target), getTargetPath(token.target));
    case 'GitGlobal':            return `git config --global ${token.name} '${token.value}'`;
    case 'GitClone':             return joinNotNull(`git clone ${token.name}`, getTargetPath(token.target), token.args);
    case 'Curl':                 return joinNotNull(`curl`, token.args, token.name, getTargetOperator(token.target), getTargetPath(token.target));
    default: return "# ? TYPE UNKNOWN " + token;
 }
}
function generateTargetOperator(operator){
  switch (operator) {
    case null : return ""
    case "None" : return ""
    case "Pipe": return "|"
    case "RedirectOutput": return ">"
    case "RedirectOutputAppend": return ">>"
    default: return "???"
  }
}
function joinNotNull(...xs)     { return _join(_filter(xs, (f) => f != null), " "); }
function getTargetPath(target)    { return (target == null) ? null : target.path; }
function getTargetOperator(target){ return (target == null) ? null : generateTargetOperator(target.operator); }

export { generate }