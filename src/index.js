
var dataUri = 'https://jeffwindsor.github.io/the-sweet-setup.io/data'

/**************************************************************
  Page Functions
**************************************************************/
var timeout = null;
function checkEditCompleteThenScript() {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    scriptSourceToTarget();
  }, 500);
};

function scriptSourceToTarget() {
  let input = document.getElementById('source').value.trim();
  //remove any trailing comma from content and place in array
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  let results = script('MacOs', 'Shell', JSON.parse(values));
  document.getElementById('target').value = _.join(results, '\n');
};

function resetAreas() {
  document.getElementById('source').value = '';
  document.getElementById('target').value = '';
};

function copyArea(elemId) {
  var copyText = document.getElementById(elemId);
  copyText.select();
  document.execCommand("copy");
};

function downloadArea(elemId) {
  let data = document.getElementById(elemId).value;
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', downloadFileName(elemId));
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function addCommand(name) {
  addFromDataUri(`command/${name}`);
}

function addScript(name){
  addFromDataUri(`script/${name}`);
}

function addScriptlet(name){
  addFromDataUri(`scriptlet/${name}`);
}

function addFromDataUri(name) {
  addFromUri(`${dataUri}/${name}.json`);
}

function addFromUriModal() {
  var uri = document.getElementById('jsonUriText').value;
  addFromUri(uri);
}

function addFromUri(uri) {
  loadJSON(uri, function(response) {
    var json = JSON.parse(response);
    addToSource(json);
  });
}

/**************************************************************
  HELPERS
**************************************************************/
function downloadFileName(elemId){
  switch (elemId) {
    case 'target': return 'setup.sh';
    case 'source': return 'source.json';
    default: return '';
  }
}

// ?  ADD ABILITY TO PULL IN PACKAGE FILE FROM LOCAL OR URI
function addToSource(addition) {
  let add = JSON.stringify(addition, undefined, 2) + ',\n';
  document.getElementById('source').value += add;
  scriptSourceToTarget();
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