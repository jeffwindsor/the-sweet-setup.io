const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');

export function tokenize(request) {
  switch (request.type) {
    case 'Header': return tokenizeShellHeader(request);   //Special type not implemented for outside use
    case 'BashFunction': return tokenizeBashFunction(request);
    case 'FishFunction': return tokenizeFishFunction(request);
    case 'FunctionPackageAsBash': return addTypeTargetToPackageTokens('BashFunction', request.target, request.name);
    case 'FunctionPackageAsFish': return addTypeTargetToPackageTokens('FishFunction', request.target, request.name);
    case 'GitAliasPackage': return addTypeTargetToPackageTokens('GitGlobal', request.target, request.name);
    case 'ScriptPackage': return tokenizeScriptPackage(request.name);
    case 'VSCodeExtensionPackage': return tokenizeScriptPackage(req.name);
    default: return request;
  }
}

function tokenizeShellHeader(request) {
  return { type: 'Comment', name: resolveShellHeader(request.os, request.language) }
}

function resolveShellHeader(os, language) {
  switch (os + language) {
    case 'MacOsShell': return "!/bin/sh"
    case 'ManjaroShell': return "!/bin/sh"
    default: return ""
  }
}

function tokenizeBashFunction(token) {
  // Add function syntax and convert to WriteToFile type
  let bash = joinNewLine(`function ${token.name}(){`, token.value, `}`)
  return newToken('WriteToFile', token.name, bash, token.target);
}

function tokenizeFishFunction(token) {
  //replace the ${@} and ${#}
  var value = token.value.replace(/\{@\}/gim, "argv");
  value = value.replace(/\{(\d+)\}/gim, "argv[$1]");
  //Make a fish function
  let fish = joinNewLine(`function ${token.name}`, value, `end`);
  // Add function syntax and convert to WriteToFile type
  return newToken('WriteToFile', token.name, fish, token.target);
}
function addTypeTargetToPackageTokens(type, target, packageName) {
  let tokens = tokenizeScriptPackage(packageName);
  tokens.forEach(t => {
    t.type = type;
    t.target = target;
  });
  return tokens;
}
function tokenizeScriptPackage(packageName) {
  // Lookup tokens and transfer target if it exists
  let tokens = loadFileTokens(packageName);
  // Traverse new tokens prior to returning
  return _flatMap(tokens, tokenize);
}
function loadFileTokens(fileName) {
  return require(`../../data/${fileName.toLowerCase()}.package.json`);
}
function newToken(type, name, value, target) {
  let result = { type: type, name: name };
  if (value != null) { result.value = value; }
  let ct = copyTarget(target);
  if (ct != null) { result.target = ct; }
  return result;
}
function isNullOrEmptyTarget(target) {
  return (target == null) || target.operator == null || target.path == null;
}
function copyTarget(target) {
  return (isNullOrEmptyTarget(target)) ? null : { operator: target.operator, path: target.path };
}
function joinNewLine(...fragments) { return _join(fragments, '\n'); }