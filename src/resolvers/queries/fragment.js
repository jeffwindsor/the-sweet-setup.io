import gitCloneResolver from './gitClone'
import curlResolver from './curl'
import bashFunctionResolver from './bashfunction'
import fishFunctionResolver from './fishfunction'
import sectionResolver from './section'
var _join = require('lodash/join');

// ? make output language specific
//Parses fragment object by type into sh sting
export default function(o){
  switch (o.type) {
   case 'ArchPackage': return spaced('sudo pacman','-S --noconfirm', o.name);
   case 'YayPackage': return spaced('yay', '-S --noconfirm', o.name);
   case 'BrewPackage': return spaced('brew install', o.name);
   case 'CaskPackage': return spaced('brew cask install', o.name);
   case 'NpmPackage': return spaced('npm install', o.name);
   case 'VsCodeExtension': return spaced('code', '--install-extension', o.name);
   case 'HaskellStackInstall': return spaced('stack install', o.name);
   case 'BashFunction': return bashFunctionResolver(o);
   case 'FishFunction': return fishFunctionResolver(o);
   case 'GitGlobal': return spaced('git config', '--global', o.name, ' ', o.value);
   case 'GitClone': return gitCloneResolver(o);
   case 'Curl': return curlResolver(o);
   case 'Section': return sectionResolver(o);
   default: return "";
 }
}

function spaced(...fragments){
  return _join(fragments, ' ');
}
function equaled(...fragments){
  return _join(fragments, ' ');
}


