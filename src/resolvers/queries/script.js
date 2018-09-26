import gitCloneResolver from './gitClone'
import curlResolver from './curl'
import bashFunctionResolver from './bashfunction'
import fishFunctionResolver from './fishfunction'
import sectionResolver from './section'
var _join = require('lodash/join');
var _flatMap = require('lodash/flatMap');

// ? make output language specific
//Parses fragment object by type into shell language
function script(fs){
  return _flatMap(fs, expandFragment)
             .map(scriptFragment);
}

function expandFragment(f){
  return f;
}
function scriptFragment(f){
  switch (f.type) {
   case 'ArchPackage': return spaced('sudo pacman','-S --noconfirm', f.name);
   case 'YayPackage': return spaced('yay', '-S --noconfirm', f.name);
   case 'BrewPackage': return spaced('brew install', f.name);
   case 'CaskPackage': return spaced('brew cask install', f.name);
   case 'NpmPackage': return spaced('npm install', f.name);
   case 'VsCodeExtension': return spaced('code', '--install-extension', f.name);
   case 'HaskellStackInstall': return spaced('stack install', f.name);
   case 'BashFunction': return bashFunctionResolver(f);
   case 'FishFunction': return fishFunctionResolver(f);
   case 'GitGlobal': return spaced('git config', '--global', f.name, `'${f.value}'`);
   case 'GitClone': return gitCloneResolver(f);
   case 'Curl': return curlResolver(f);
   case 'Section': return sectionResolver(f);
   default: return "";
 }
}

function spaced(...fragments){
  return _join(fragments, ' ');
}
function equaled(...fragments){
  return _join(fragments, ' ');
}

export {script, scriptFragment}
