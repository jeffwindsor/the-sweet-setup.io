// IF NODE
const _ = require('lodash');

/***************************************************
	SCRIPT
***************************************************/
function script(os, language, requests) {
  let header = [{ type: 'header', value:'#!/bin/sh' }];
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

    case 'header': // ? does not consider language or OS
      return { type:'comment', name:'!/bin/sh'};
    case 'vscodeextension':
      return { type:'codeinstallextension', name:request.name};
    case 'fish':
      return copyTargetTo( request.target, { type:'writetofile', name:request.name, value:buildFishFunction(request)});
    case 'bash':
      return copyTargetTo( request.target, { type:'writetofile', name:request.name, value:buildBashFunction(request)});
    case 'gitglobal':
      return copyTargetTo( request.target, { type:'gitconfigglobal', name:request.name});


    case 'package':
      console.log(request);
      return tokenizePackage(request.name, request.value, request.target);

    default:
      return request;
  }
}

function buildBashFunction(request) {
  return _.join([`function ${request.name}(){`, request.value, `}`], '\n');
}

function buildFishFunction(request) {
  // replace arg syntax for fish
  var value = request.value
    .replace(/\{@\}/gim, "argv")
    .replace(/\{(\d+)\}/gim, "argv[$1]");
    return _.join([`function ${request.name}`, value, `end`], '\n');
}

function tokenizePackage(packageName, defaultType, defaultTarget) {
  let packageTokens = loadPackage(packageName);
  packageTokens.forEach(t => {
    if(defaultType != null && !existNotNull(t,'type'))     {t.type = defaultType;}
    if(defaultTarget != null && !existNotNull(t,'target')) {copyTargetTo(defaultTarget, t);}
  });
  let tokens = packageTokens.map(tokenize);
  return tokens;
}
function existNotNull(o, property){ return o.hasOwnProperty(property) && o[property]; }
function loadPackage(packageName) {
  return require(`./data/${packageName.toLowerCase()}.package.json`);
}

function copyTargetTo(target, token) {
  if(target != null) {
    token.target = {operator:target.operator, path:target.path}
  }
  return token;
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
function joinNotNull(...xs) { return _.join(_.filter(xs, (f) => f != null), " "); }
function generateTargetPath(target) { return (target == null) ? null : target.path; }
function generateTargetOperator(target, f) { return (target == null) ? null : f(target.operator); }

/***************************************************
	GENERATE - SH
***************************************************/
function generateSH(token) {
  switch (token.type.toLowerCase()) {
    case 'comment': return `#${token.name}`;
    case 'info': return `echo -e '==> ${token.name}'`;
    case 'variable': return `${token.name}=${token.value}`
    case 'archpackage': return `sudo pacman -S --noconfirm ${token.name}`;
    case 'yaypackage': return `yay -S --noconfirm ${token.name}`;
    case 'brewpackage': return `brew install ${token.name}`;
    case 'caskpackage': return `brew cask install ${token.name}`;
    case 'npmpackage': return `npm install ${token.name}`;
    case 'codeinstallextension': return `code --install-extension ${token.name}`;
    case 'haskellstackinstall': return `stack install ${token.name}`;
    case 'writetofile': return joinNotNull(`echo -e '${token.value}'`, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    case 'gitconfigglobal': return `git config --global ${token.name} '${token.value}'`;
    case 'gitclone': return joinNotNull(`git clone ${token.name}`, generateTargetPath(token.target), token.args);
    case 'curl': return joinNotNull(`curl`, token.args, token.name, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    default: return "# ? TYPE UNKNOWN " + token;
  }
}
function generateTargetOperatorSH(operator) {
  switch (operator.toLowerCase()) {
    case null: return "";
    case "none": return "";
    case "pipe": return "|";
    case "redirectoutput": return ">";
    case "redirectoutputappend": return ">>";
    default: return "???";
  }
}

export {tokenize, script, tokenizePackage, loadPackage}