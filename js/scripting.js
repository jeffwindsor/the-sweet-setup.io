/***************************************************
	SCRIPT
***************************************************/
function script(os, language, requests) {
  let header = [{ type: 'header', value: '#!/bin/sh' }];
  let list = header.concat(requests);
  let tokens = _.flatMap(list, request => tokenize(request));
  let outputs = tokens.map(token => generate(os, language, token));
  return outputs;
}

/***************************************************
	TOKENIZE
***************************************************/
function tokenize(request) {
  switch (request.type.toLowerCase()) {
    case 'header': return { type: 'comment', comment: '!/bin/sh' };
    case 'fish': return { type: 'file', content: buildFishFunction(request), target: request.target };
    case 'bash': return { type: 'file', content: buildBashFunction(request), target: request.target };
    case 'vscode-package': return _.map(request.extensions, i => { 
      return { type: 'code', extension_name: i.extension_name }; });
    case 'fish-package':
      return _.map(request.functions, i => {
        return { type: 'file', content: buildFishFunction(i), target: buidlFishTarget(request.target) };
      });
    case 'bash-package': return _.map(request.functions, i => { 
      return { type: 'file', content: buildBashFunction(i), target: request.target }; });
    case 'gitconfig-package': return _.map(request.globals, i => { 
      return { type: 'gitconfig', name: i.name, value: i.value }; });
    default: return request;
  }
}

function buidlFishTarget(target){
  return (target == null)
    ? { operator: 'redirect', path: `~/.config/fish/functions/${i.function_name}.fish` }
    : target;
}
function buildBashFunction(request) {
  return `function ${request.function_name}(){\n  ${request.function_body}\n}`;
}

function buildFishFunction(request) {
  var body = request.function_body
    .replace(/\{@\}/gim, 'argv')
    .replace(/\{(\d+)\}/gim, 'argv[$1]');
  return `function ${request.function_name}\n  ${body}\nend`;
}

/***************************************************
	GENERATE
***************************************************/
function generate(os, language, token) {
  switch (language) {
    case 'Shell': return generateSH(token);
    default: return `language ${language} unknown`;
  }
}
function joinNotNull(...xs) { return _.join(_.filter(xs, (f) => f != null), ' '); }
function generateTargetPath(target) { return (target == null) ? null : target.path; }
function generateTargetOperator(target, f) { return (target == null) ? null : f(target.operator); }

/***************************************************
	GENERATE - SH
***************************************************/
function generateSH(token) {
  switch (token.type.toLowerCase()) {
    case 'comment': return `#${token.comment}`;
    case 'echo': return `echo '==> ${token.message}'`;
    case 'variable': return `${token.name}=${token.value}`
    case 'pacman': return `sudo pacman -S --noconfirm ${token.package_name}`;
    case 'yay': return `yay -S --noconfirm ${token.package_name}`;
    case 'brew': return `brew install ${token.package_name}`;
    case 'cask': return `brew cask install ${token.package_name}`;
    case 'npm': return `npm install ${token.package_name}`;
    case 'code': return `code --install-extension ${token.extension_name}`;
    case 'stack': return `stack install ${token.package_name}`;
    case 'file': return joinNotNull(`echo '${token.content}'`, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    case 'gitconfig': return `git config --global ${token.name} '${token.value}'`;
    case 'gitclone': return joinNotNull(`git clone ${token.uri}`, token.output_dir, token.args);
    case 'curl': return joinNotNull(`curl`, token.args, token.uri, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    default: return '# ? TYPE UNKNOWN ' + token;
  }
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