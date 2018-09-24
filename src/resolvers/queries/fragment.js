import gitCloneResolver from './gitClone'
import curlResolver from './curl'
import bashFunctionResolver from './bashfunction'
import fishFunctionResolver from './fishfunction'
import sectionResolver from './section'

// ? make output language specific
//Parses fragment object by type into sh sting
export default function(o){
  switch (o.type) {
   case 'ArchPackage': return `sudo pacman -S --noconfirm ${o.name}`;
   case 'YayPackage': return `yay -S --noconfirm ${o.name}`;
   case 'BrewPackage': return `brew install ${o.name}`;
   case 'CaskPackage': return `brew cask install ${o.name}`;
   case 'NpmPackage': return `npm install ${o.name}`;
   case 'VsCodeExtension': return `code --install-extension ${o.name}`;
   case 'HaskellStackInstall': return `stack install ${o.name}`;
   case 'BashFunction': return bashFunctionResolver(o);
   case 'FishFunction': return fishFunctionResolver(o);
   case 'GitGlobal': return `git config --global ${o.name} "${o.value}"`;
   case 'GitClone': return gitCloneResolver(o);
   case 'Curl': return curlResolver(o);
   case 'Section': return sectionResolver(o);
   default: return "";
 }
}


