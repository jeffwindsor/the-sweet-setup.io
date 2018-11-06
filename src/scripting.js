/***************************************************
	SCRIPT
***************************************************/
function script(content) {
  let contentWithHeader = [{ type: 'header', value: '#!/bin/sh' }].concat(content);
  let tokens   = _.flatMap(contentWithHeader, request => tokenize(request));
  return _.map(tokens, token => generate(token));
}

/***************************************************
	TOKENIZE
***************************************************/
function tokenize(input) {
    if(input.hasOwnProperty('bashfunction')){
      return { file: buildBashFunction(input.bashfunction, input.function_body), target: buildBashTarget(input.target) };
    }
    if(input.hasOwnProperty('fishfunction')){
      return { file: buildFishFunction(input.fishfunction, input.function_body), target: buildFishTarget(input.fishfunction, input.target) };
    }
    if(input.hasOwnProperty('header')){
      return { comment: '!/bin/sh' };
    }
    return input;
}

function getUriContent(uri) {
  return fetch(uri)
    .then(function (response) {
      return response.text();
    });
}

function buildBashFunction(fishfunction, function_body) {
  return `function ${fishfunction}(){\n  ${function_body}\n}`;
}

function buildBashTarget(target) {
  return (target == null)
    ? { operator: 'redirectappend', path: `~/.bashrc` }
    : { ...target };
}

function buildFishFunction(fishfunction, function_body) {
  var body = function_body
    .replace(/\{@\}/gim, 'argv')
    .replace(/\{(\d+)\}/gim, 'argv[$1]');
  return `function ${fishfunction}\n  ${body}\nend`;
}

function buildFishTarget(fishfunction, target) {
  return (target == null)
    ? { operator: 'redirect', path: `~/.config/fish/functions/${fishfunction}.fish` }
    : { ...target };
}

/***************************************************
	GENERATE SHELL
***************************************************/
function generate(token) {
  if(token.hasOwnProperty('brew')) { return `brew install ${token.brew}`; }
  if(token.hasOwnProperty('cask')) { return `brew cask install ${token.cask}`; }
  if(token.hasOwnProperty('codeext')) { return `code --install-extension ${token.codeext}`; }
  if(token.hasOwnProperty('comment')) { return `#${token.comment}`; }
  if(token.hasOwnProperty('curl')) { return joinNotNull(`curl`, token.args, token.curl,
    generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target)); }
  if(token.hasOwnProperty('echo')) { return `echo '${token.echo}'`; }
  if(token.hasOwnProperty('file')) { return joinNotNull(`echo '${token.file}'`,
    generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target)); }
  if(token.hasOwnProperty('gitclone')) { return joinNotNull(`git clone ${token.gitclone}`, token.output_dir, token.args); }
  if(token.hasOwnProperty('gitconfig')) { return `git config --global ${token.gitconfig} '${token.value}'`; }
  if(token.hasOwnProperty('npm')) { return `npm install ${token.npm}`; }
  if(token.hasOwnProperty('pacman')) { return `sudo pacman -S --noconfirm ${token.pacman}`; }
  if(token.hasOwnProperty('stack')) { return `stack install ${token.stack}`; }
  if(token.hasOwnProperty('variable')) { return `${token.variable}=${token.value}`;}
  if(token.hasOwnProperty('yay')) { return `yay -S --noconfirm ${token.yay}`;}

  return '# COULD NOT GENERATE: ' + token;
}
function generateTargetOperatorSH(operator) {
  switch (operator.toLowerCase()) {
    case null: return '';
    case 'none': return '';
    case 'pipe': return '|';
    case 'redirect': return '>';
    case 'redirectappend': return '>>';
    default: return '???';
  }
}
function joinNotNull(...xs) { return _.join(_.filter(xs, (f) => f != null), ' '); }
function generateTargetPath(target) { return (target == null) ? null : target.path; }
function generateTargetOperator(target, f) { return (target == null) ? null : f(target.operator); }
