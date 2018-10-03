const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');

export function tokenize(request) {
  switch (request.type) {
    case 'Header': return convertToCommentToken(request);   //Special type not implemented for outside use
    case 'BashFunction': return convertToBashFunctionToWriteToFile(request);
    case 'FishFunction': return convertToFishFunctionToWriteToFile(request);
    case 'FunctionPackageAsBash': return addTypeTargetToPackageTokens('BashFunction', request.target, request.name);
    case 'FunctionPackageAsFish': return addTypeTargetToPackageTokens('FishFunction', request.target, request.name);
    case 'GitAliasPackage': return addTypeTargetToPackageTokens('GitGlobal', request.target, request.name);
    // case 'RequestPackage': return tokenizeScriptPackage(request.name);
    case 'WritePackageToFile': return newToken('WriteToFile',request.name, serializePackage(request.name), request.target)
    case 'VSCodeExtensionPackage': return tokenizeScriptPackage(request.name);
    default: return request;
  }
}

function convertToCommentToken(request) {
  let comment =  convertToOsLanguageComment(request.os, request.language);
  return { type: 'Comment', name: comment }
}

function convertToOsLanguageComment(os, language) {
  switch (os + language) {
    case 'MacOsShell': return "!/bin/sh"
    case 'ManjaroShell': return "!/bin/sh"
    default: return ""
  }
}

function convertToBashFunctionToWriteToFile(token) {
  // Add function syntax and convert to WriteToFile type
  let bash = joinNewLine(`function ${token.name}(){`, token.value, `}`)
  return newToken('WriteToFile', token.name, bash, token.target);
}

function convertToFishFunctionToWriteToFile(token) {
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
function serializePackage(packageName){
  return JSON.stringify(loadFileTokens(packageName));
}
function loadFileTokens(packageName) {
  // * Currently file based
  return require(`../../data/${packageName.toLowerCase()}.package.json`);
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