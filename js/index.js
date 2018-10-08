/***************************************************
	PAGE
***************************************************/
document.getElementById("scriptButton").onclick = scriptMyStuff;
function scriptMyStuff() {
  let values = "[" + document.getElementById("source").value + "]";
  let reqs = JSON.parse(values);
	let results = script("MacOs","Shell", reqs);
  document.getElementById("target").innerHTML = _.join(results, "\n");
}

/***************************************************
	SCRIPT
***************************************************/
function script(os, language, requests){
  // Add Header to requests and tokenize tree
  let tokens  = _.flatMap([{type:"Header", os:os, language:language}].concat(requests), request => tokenize(request));
  // Generate tokens in order
  return tokens.map( token => generate(os, language, token) );
}

/***************************************************
	TOKENIZE
***************************************************/
function tokenize(request) {
  switch (request.type) {
    case 'Header': return tokenizeHeaderComment(request);   //Special type not implemented for outside use
    case 'BashFunction': return tokenizeBashFunction(request);
    case 'FishFunction': return tokenizeFishFunction(request);
    case 'FunctionPackageAsBash': return tokenizePackageWithTypeAndTarget('BashFunction', request.target, request.name);
    case 'FunctionPackageAsFish': return tokenizePackageWithTypeAndTarget('FishFunction', request.target, request.name);
    case 'GitAliasPackage': return tokenizePackageWithTypeAndTarget('GitGlobal', request.target, request.name);
    case 'VSCodeExtensionPackage': return tokenizePackage(request.name);
    default: return request;
  }
}

function tokenizeHeaderComment(request) {
  let comment =  getHeaderComment(request.os, request.language);
  return { type: 'Comment', name: comment }
}
function getHeaderComment(os, language) {
  switch (os + language) {
    case 'MacOsShell': return "!/bin/sh";
    case 'ManjaroShell': return "!/bin/sh";
    default: return ""
  }
}

function tokenizeBashFunction(token) {
  let f = joinNewLine(`function ${token.name}(){`, token.value, `}`)
  return newToken('WriteToFile', token.name, f, token.target);
}
function tokenizeFishFunction(token) {
  // replace arg syntax for fish
  var value = token.value
                .replace(/\{@\}/gim, "argv")
                .replace(/\{(\d+)\}/gim, "argv[$1]");
  let f = joinNewLine(`function ${token.name}`, value, `end`);
  return newToken('WriteToFile', token.name, f, token.target);
}
function joinNewLine(...fragments) { return _.join(fragments, '\n'); }

function tokenizePackageWithTypeAndTarget(type, target, packageName) {
  let tokens = tokenizePackage(packageName);
  tokens.forEach(t => {
    t.type = type;
    t.target = target;
  });
  return tokens;
}

function tokenizePackage(packageName) {
  let tokens = require(`../../data/${packageName.toLowerCase()}.package.json`);
  return _.flatMap(tokens, tokenize);
}
function newToken(type, name, value, target) {
  return { type: type, name: name, value: value, target: target };
}


/***************************************************
	GENERATE
***************************************************/
function generate(os, language, token){
  switch(language){
    case 'Shell': return generateSH(token);
    default:      return `language ${language} unknown`;
  }
}
function joinNotNull(...xs)     { return _.join(_.filter(xs, (f) => f != null), " "); }
function generateTargetPath(target)    { return (target == null) ? null : target.path; }
function generateTargetOperator(target, f){ return (target == null) ? null : f(target.operator); }

/***************************************************
	GENERATE - SH
***************************************************/
function generateSH(token){
  switch (token.type) {
    case 'Comment':              return `#${token.name}`;
    case 'Info':                 return `echo -e '==> ${token.name}'`;
    case 'Variable':             return `${token.name}=${token.value}`
    case 'ArchPackage':          return `sudo pacman -S --noconfirm ${token.name}`;
    case 'YayPackage':           return `yay -S --noconfirm ${token.name}`;
    case 'BrewPackage':          return `brew install ${token.name}`;
    case 'CaskPackage':          return `brew cask install ${token.name}`;
    case 'NpmPackage':           return `npm install ${token.name}`;
    case 'VsCodeExtension':      return `code --install-extension ${token.name}`;
    case 'HaskellStackInstall':  return `stack install ${token.name}`;
    case 'WriteToFile':          return joinNotNull(`echo -e '${token.value}'`, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    case 'GitGlobal':            return `git config --global ${token.name} '${token.value}'`;
    case 'GitClone':             return joinNotNull(`git clone ${token.name}`, generateTargetPath(token.target), token.args);
    case 'Curl':                 return joinNotNull(`curl`, token.args, token.name, generateTargetOperator(token.target, generateTargetOperatorSH), generateTargetPath(token.target));
    default: return "# ? TYPE UNKNOWN " + token;
 }
}
function generateTargetOperatorSH(operator){
  switch (operator) {
    case null : return "";
    case "None" : return "";
    case "Pipe": return "|";
    case "RedirectOutput": return ">";
    case "RedirectOutputAppend": return ">>";
    default: return "???";
  }
}