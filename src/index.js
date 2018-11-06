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
//=======================================================
//  Event Handlers
function onAddLocalUriClick(name) { addUriContentToSource(`${dataUri}/${name}.json`); }
function onAddRemoteUriClick() { addUriContentToSource(document.getElementById('jsonUriText').value); }
function onSourceKeyUp() {
  //on each keyup restart timer
  clearTimeout(timeout);
  //when timer expires, signal document.getElementById('source') content change
  timeout = setTimeout(scriptContent, 500);
};

//=======================================================
// METHODS AND FUNCTIONS
function scriptContent() {
  let object = toArray(document.getElementById('source').value);
  document.getElementById('target').value = _.join(script(object), '\n');
}

function addUriContentToSource(uri) {
  fetch(uri)
    .then((content) => {
      let one = toArray(document.getElementById('source').value);
      let two = toArray(content);
      let merged = _.concat(one, two);
      document.getElementById('source').value = merged;
      scriptContent();
    });
}

function replaceUriContentInSource(uri, original){
  fetch(uri)
  .then((content) => {
    let current = toArray(document.getElementById('source').value);
    let left    = _.takeWhile(current, (item) => item != original);
    let right   = _.takeRightWhile(current, (item) => item != original);
    let merged  = _.concat(_.concat(left, content), right);
    document.getElementById('source').value = merged;
    scriptContent();
  });
}


function reset() {
  document.getElementById('source').value = empty;
  document.getElementById('target').value = empty;
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
