//=======================================================
let dataUri  = 'https://jeffwindsor.github.io/the-sweet-setup.io/data';
let empty    = '';
var timeout  = null;
//=======================================================
// PROPERTIES
function element(id){return document.getElementById(id);}
function source(){ return element('source'); }
function target(){ return element('target'); }
function modal(){ return element('jsonUriText'); }

//=======================================================
//  Events
function onAddLocalUriClick(name) { addUriContent(`${dataUri}/${name}.json`); }
function onAddRemoteUriClick() { addUriContent(modal.value); }
function onSourceChange(){
  let source = getSourceJson();
  let shell = script(source);
  setTargetValue(shell);
}
function onSourceKeyUp() {
  //on each keyup restart timer
  clearTimeout(timeout);
  //when timer expires, signal source content change
  timeout = setTimeout(onSourceChange, 500);
};

//=======================================================
// METHODS AND FUNCTIONS
function addContentToSource(content) {
  let add = JSON.parse(content);
  let current = JSON.parse()

  let json = JSON.stringify(array, undefined, 2) + ',\n';
  source.value += json;
  onSourceChange();
};

function addUriContent(uri) {
  getUriContentAsync(uri, addContentToSource);
}

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

function downloadFileName(elemId){
  switch (elemId) {
    case targetId: return 'setup.sh';
    case sourceId: return 'source.json';
    default: return empty;
  }
}

function getUriContentAsync(uri, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', uri, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '404') {
          alert(`${uri} not found, try again.`)
        }
        if (xobj.readyState == 4 && xobj.status == '200') {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);
}

function getSourceJson(){
  let input = source.value.trim();
  //remove any trailing comma from content and place in array
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  return JSON.parse(values);
}

function reset() {
  source.value = empty;
  target.value = empty;
};

function setTargetValue(json){
  target.value = _.join(json, '\n');
}


