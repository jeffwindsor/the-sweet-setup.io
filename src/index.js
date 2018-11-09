function jsonToObjectArray(content) {
  return JSON.parse(content);
}

function objectToJson(json) {
  return JSON.stringify(json, undefined, 2);
}

function downloadFileName(elemId) {
  switch (elemId) {
    case targetId: return 'setup.sh';
    case sourceId: return 'source.json';
    default: return 'unknown.dat';
  }
}

function mergeContent(s1, s2) {
  const a1 = jsonToObjectArray(s1);
  const a2 = jsonToObjectArray(s2);
  const am = _.concat(a1, a2);
  return objectToJson(am);
}

function replaceInContent(content, replaceThis, withThat) {
  return _.map(content, (o) => (o === replaceThis) ? withThat : o);
}

//=======================================================
// Feilds and Properties
const dataUri = 'https://jeffwindsor.github.io/the-sweet-setup.io/data';
const toEmpty = () => '';
const sourceId = 'main-body-source-textarea';
const targetId = 'main-body-target-textarea';
var timeout = null;

// function getSource(){
//   const sourceAsText = document.getElementById('source').value
//   return jsonToObjectArray(sourceAsText);
// }
// function setSource(obj){
//   const content = (obj) ? JSON.stringify(obj, undefined, 2) : "";
//   document.getElementById('source').value = content;
//   onSourceMutated();
// }
// function setTarget(obj){
//   const content = (Array.isArray(obj)) ? _.join(obj, '\n') : "";
//   document.getElementById('target').value = content;
// }

//=======================================================
//  Event Handlers
function onAddLocalUriClick(name) { addUriContentToSource(`${dataUri}/${name}.json`); }
function onAddRemoteUriClick() { addUriContentToSource(document.getElementById('jsonUriText').value); }
function onSourceKeyUp() {
  //on each keyup restart timer
  clearTimeout(timeout);
  //when timer expires, signal document.getElementById(sourceId) content change
  timeout = setTimeout(onSourceMutated, 500);
};
function onSourceMutated() {
  const scripted = script(getSource());
  setTarget(scripted);
  const links = _.filter(source, (token) => token.hasOwnProperty('link'));
  _.each(links, r => replaceUriContentInSource(r.link, r))
}

//=======================================================
// METHODS AND FUNCTIONS
function getUriText(uri, callback) {
  fetch(uri)
    .then(response => response.text())
    .then((content) => {
      callback(content);
    });
}

function mutateElemValue(id, withF) {
  const elem = document.getElementById(id);
  elem.value = withF(elem.value);
}
function mutateTargetValue(withF) {
  mutateElemValue(targetId, withF);
}
function mutateSourceValue(withF) {
  mutateElemValue(sourceId, withF);
  onSourceMutated();
}

function addUriContentToSource(uri) {
  getUriText(uri,
    (uriContent) => mutateSourceValue(
      (current) => mergeContent(current, uriContent)));
}

function replaceUriContentInSource(uri, replaceThis) {
  getUriText(uri,
    (uriContent) => mutateSourceValue(
      (current) => replaceInContent(current, replaceThis, uriContent)));
}

function reset() {
  mutateSourceValue(toEmpty);
  mutateTargetValue(toEmpty);
};

function copy(elemId) {
  var copyText = element(elemId);
  copyText.select();
  document.execCommand('copy');
};

function download(elemId) {
  const data = element(elemId).value;
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', downloadFileName(elemId));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
