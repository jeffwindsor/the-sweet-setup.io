function toArray(content) {
  if (content == '' || content == null) {
    return [];
  }
  else {
    let object = JSON.parse(removeTrailingComma(content));
    return (Array.isArray(object)) ? object : [object];
  }
}

function toString(object) {
  return JSON.stringify(object, undefined, 2);
}

function removeTrailingComma(content) {
  let text = content.trim();
  return (text.slice(-1) == ',')
    ? text.slice(0, -1)
    : text
}

function downloadFileName(elemId) {
  switch (elemId) {
    case targetId: return 'setup.sh';
    case sourceId: return 'source.json';
    default: return empty;
  }
}

//=======================================================
// Feilds and Properties
let dataUri = 'https://jeffwindsor.github.io/the-sweet-setup.io/data';
let empty = '';
var timeout = null;
function getSource(){
  let sourceAsText = document.getElementById('source').value
  return toArray(sourceAsText);
}
function setSource(obj){
  let content = (obj) ? JSON.stringify(obj, undefined, 2) : "";
  document.getElementById('source').value = content;
  onSourceChanged();
}
function setTarget(content){ document.getElementById('target').value = content; }
//=======================================================
//  Event Handlers
function onAddLocalUriClick(name) { addUriContentToSource(`${dataUri}/${name}.json`); }
function onAddRemoteUriClick() { addUriContentToSource(document.getElementById('jsonUriText').value); }
function onSourceKeyUp() {
  //on each keyup restart timer
  clearTimeout(timeout);
  //when timer expires, signal document.getElementById(sourceId) content change
  timeout = setTimeout(onSourceChanged, 500);
};
function onSourceChanged(){
  let source = getSource();
  scriptContentToTarget(source);
  //resolveLinksInSourceAsync(source);
}

//=======================================================
// METHODS AND FUNCTIONS
function scriptContentToTarget(contentArray) {
  let content = _.join(script(contentArray), '\n');
  setTarget(content);
}

function resolveLinksInSourceAsync(array){
  let links = _.filter(array, (token) => token.hasOwnProperty('link'));
  _.map(links, r => replaceUriContentInSource(r.link, r))
}

function addUriContentToSource(uri) {
  fetch(uri)
    .then(response => response.text())
    .then((content) => {
      let merged = _.concat(getSource(), toArray(content));
      setSource(merged);
    });
}

function replaceUriContentInSource(uri, original){
  fetch(uri)
  .then(response => response.text())
  .then((content) => {
    let current = getSource();
    let left    = _.takeWhile(current, (item) => item != original);
    let right   = _.takeRightWhile(current, (item) => item != original);
    let merged  = _.concat(_.concat(left, content), right);
    setSource(merged);
  });
}


function reset() {
  setSource(empty);
  setTarget(empty);
};

function copy(elemId) {
  var copyText = element(elemId);
  copyText.select();
  document.execCommand('copy');
};

function download(elemId) {
  let data = element(elemId).value;
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', downloadFileName(elemId));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
