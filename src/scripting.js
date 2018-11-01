/***************************************************
	SCRIPT
***************************************************/
function scriptInput(os, language, input) {
  //remove any trailing comma from content and place in array
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  let results = script(os, language, JSON.parse(values));
  return _.join(results, '\n');
};

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
function tokenize(input) {
  switch (input.type.toLowerCase()) {
    case 'bash-function': return { type: 'file', content: buildBashFunction(input), target: buildBashTarget(input) };
    case 'fish-function': return { type: 'file', content: buildFishFunction(input), target: buildFishTarget(input) };
    case 'group': return _.flatMap(input.items, i => {
      return (input.target == null)
        ? tokenize({ type: input.itemType, ...i })
        : tokenize({ type: input.itemType, ...i, target: { ...input.target } });
    });
    case 'header': return { type: 'comment', comment: '!/bin/sh' };
    case 'vscode-extension': return { type: 'code', extension_name: input.extension_name };
    default: return input;
  }
}

function buildBashFunction(input) {
  return `function ${input.function_name}(){\n  ${input.function_body}\n}`;
}

function buildBashTarget(input) {
  return (input.target == null)
    ? { operator: 'redirectappend', path: `~/.bashrc` }
    : { ...input.target };
}

function buildFishFunction(input) {
  var body = input.function_body
    .replace(/\{@\}/gim, 'argv')
    .replace(/\{(\d+)\}/gim, 'argv[$1]');
  return `function ${input.function_name}\n  ${body}\nend`;
}

function buildFishTarget(input) {
  return (input.target == null)
    ? { operator: 'redirect', path: `~/.config/fish/functions/${input.function_name}.fish` }
    : { ...input.target };
}

/***************************************************
	GENERATE
***************************************************/
function generate(token) {
  switch (token.type.toLowerCase()) {
    case 'brew': return `brew install ${token.package_name}`;
    case 'cask': return `brew cask install ${token.package_name}`;
    case 'code': return `code --install-extension ${token.extension_name}`;
    case 'comment': return `#${token.comment}`;
    case 'curl': return joinNotNull(`curl`, token.args, token.uri,
      generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    case 'echo': return `echo '==> ${token.message}'`;
    case 'file': return joinNotNull(`echo '${token.content}'`,
      generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    case 'gitclone': return joinNotNull(`git clone ${token.uri}`, token.output_dir, token.args);
    case 'gitconfig': return `git config --global ${token.name} '${token.value}'`;
    case 'npm': return `npm install ${token.package_name}`;
    case 'pacman': return `sudo pacman -S --noconfirm ${token.package_name}`;
    case 'stack': return `stack install ${token.package_name}`;
    case 'variable': return `${token.name}=${token.value}`
    case 'yay': return `yay -S --noconfirm ${token.package_name}`;
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
function joinNotNull(...xs) { return _.join(_.filter(xs, (f) => f != null), ' '); }
function generateTargetPath(target) { return (target == null) ? null : target.path; }
function generateTargetOperator(target, f) { return (target == null) ? null : f(target.operator); }
