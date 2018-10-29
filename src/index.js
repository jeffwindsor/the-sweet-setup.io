let dataUri = 'https://jeffwindsor.github.io/the-sweet-setup.io/data'
var timeout = null;

/**************************************************************
  Non Deterministic Document Functions
**************************************************************/
function getElement(id){ return document.getElementById(id); }
function getElementValue(id){return getElement(id).value.trim();}
function setElementValue(id, text){ getElement(id).value = text;}
function addToElementValue(id, text){ getElement(id).value += text;}
function createElement(type){ return document.createElement(type); }
function executeCommand(command){ document.execCommand(command); }

/**************************************************************
  Non Deterministic Page Functions
**************************************************************/
function addToSourceThenScript(text) {
  addToElementValue('source', text);
  scriptSourceToTarget();
}
function scriptSourceToTarget(){ scriptText('MacOs', 'Shell', getElementValue('source'), (text) => addToElementValue('target', text)); }
function resetSourceTarget()  { resetTextAreas(setElementValue);}
function addFromUriModal()    { addFromUri( getElementValue('jsonUriText'), addToSourceThenScript); }
function addCommand(name)     { addFromUri(getCommandUri(name), addToSourceThenScript);}
function addScript(name)      { addFromUri(getScriptUri(name), addToSourceThenScript);}
function addScriptlet(name)   { addFromUri(getScriptletUri(name), addToSourceThenScript); }

function checkEditCompleteThenScript() {
  clearTimeout(timeout);
  timeout = setTimeout(function () { scriptSourceToTarget(); }, 500);
}
function copyArea(id) {
  var copyText = getElement(id);
  copyText.select();
  execCommand("copy");
}
function downloadArea(id) {
  let data = getElementValue(id);
  let element = createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', downloadFileName(id));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**************************************************************
  Deterministic Page Functions
**************************************************************/
function scriptText(os, language, text, callback) {
  callback(scriptInput(os, language, text));
};
function resetTextAreas(callback) {
  callback('source','');
  callback('target','');
}
function getCommandUri(name) { return getDataUri(`command/${name}`);}
function getScriptUri(name){ return getDataUri(`script/${name}`);}
function getScriptletUri(name){ return getDataUri(`scriptlet/${name}`); }
function getDataUri(name) { return `${dataUri}/${name}.json`; }
function addFromUri(uri, callback) {
  loadJSON(uri, function(response) {
    let json = JSON.parse(response);
    let text = JSON.stringify(json, undefined, 2) + ',\n';
    callback(text);
  });
}
function loadJSON(uri, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', uri, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "404") {
          alert(`${uri} not found, try again.`)
        }
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);
}
function downloadFileName(id){
  switch (id) {
    case 'target': return 'setup.sh';
    case 'source': return 'source.json';
    default: return '';
  }
}