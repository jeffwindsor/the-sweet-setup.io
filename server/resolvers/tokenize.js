const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');
const list_directory = "../../data/lists"

export function tokenize(request) {
  switch (request.type) {
    case 'Header':       return tokenizeShellHeader(request);   //Special type not implemented for outside use
    case 'BashFunction': return tokenizeBashFunction(request);
    case 'FishFunction': return tokenizeFishFunction(request);
    case 'List':         return tokenizeList(request);
    default:             return request;
  }
}

function tokenizeShellHeader(request){
  return {type:'Comment', name:resolveShellHeader(request.os, request.language)}
}

function resolveShellHeader(os, language){
  switch (os+language) {
    case 'MacOsShell': return "!/bin/sh"
    case 'ManjaroShell': return "!/bin/sh"
    default: return ""
  }
}

function tokenizeBashFunction(token){
  // Add function syntax and convert to WriteToFile type
  let bash = joinNewLine(`function ${token.name}(){`, token.value, `}`)
  return newToken('WriteToFile', token.name, bash, token.target);
}

function tokenizeFishFunction(token){
  // Add function syntax and convert to WriteToFile type
  let fish = joinNewLine(`function ${token.name}`, token.value, `end`);
  return newToken('WriteToFile', token.name, fish, token.target);
}

function tokenizeList(token){
  // Lookup tokens and transfer target if it exists
  let tokens = require(`${list_directory}/${token.name.toLowerCase()}.json`);
  if(tokens.target != null){
    tokens.forEach(f => f.target = target);
  }
  // Traverse new tokens prior to returning
  return _flatMap(tokens, tokenize);
}

function newToken(type, name, value, target) {
  return { type: type, name: name, value: value, target: copyTarget(target) };
}
function isNullOrEmptyTarget(target){
  return (target == null) || target.operator == null || target.path == null;
}
function copyTarget(target){
  return (isNullOrEmptyTarget(target)) ? null : { operator: target.operator, path: target.path };
}
function joinNewLine(...fragments) { return _join(fragments, '\n'); }