//=======================================================
let dataUri  = 'https://jeffwindsor.github.io/the-sweet-setup.io/data';
let targetId = 'target';
let sourceId = 'source';
let empty    = '';
var timeout  = null;

//=======================================================
function onAddLocalUriClick(name) { addUriContent(`${dataUri}/${name}.json`); }
function onAddRemoteUriClick() { addUriContent(document.getElementById('jsonUriText').value); }
function onSourceChange(){ 
  let shell = script(getSourceJson())
  setTargetShell(shell); 
}
function onSourceKeyUp() {
  //on each keyup restart timer
  clearTimeout(timeout);
  //when timer expires, signal source content change
  timeout = setTimeout(onSourceChange, 500);
};

//=======================================================
function addContentToSource(content) {
  let json = JSON.stringify(JSON.parse(content), undefined, 2) + ',\n';
  document.getElementById(sourceId).value += json;
  onSourceChange();
};

function addUriContent(uri) { 
  getUriContentAsync(uri, addContentToSource); 
}

function copy(elemId) {
  var copyText = document.getElementById(elemId);
  copyText.select();
  document.execCommand('copy');
};

function download(elemId) {
  let data = document.getElementById(elemId).value;
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
  let input = document.getElementById(sourceId).value.trim();
  //remove any trailing comma from content and place in array
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  return JSON.parse(values);
}

function reset() {
  document.getElementById(sourceId).value = empty;
  document.getElementById(targetId).value = empty;
};

function setTargetShell(json){
  document.getElementById(targetId).value = _.join(json, '\n');
}


