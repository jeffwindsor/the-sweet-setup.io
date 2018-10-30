var dataUri = 'https://jeffwindsor.github.io/the-sweet-setup.io/data'

function resetSourceTarget(dom) {
  dom.getElementById('source').value = '';
  dom.getElementById('target').value = '';
};

function addCommand(name)  { addDataUri(`command/${name}`); }
function addScript(name)   { addDataUri(`script/${name}`); }
function addScriptlet(name){ addDataUri(`scriptlet/${name}`);}
function addDataUri(name)  { addFromUri(`${dataUri}/${name}.json`);}
function addModalUri()     { addFromUri(document.getElementById('jsonUriText').value);}
function addFromUri(uri)   { loadJSON(uri, addToSource);}
function addToSource(response) {
    document.getElementById('source').value += JSON.stringify(JSON.parse(response), undefined, 2) + ',\n';
    scriptSourceToTarget();
}
function scriptSourceToTarget() {
  let input = document.getElementById('source').value.trim();
  //remove any trailing comma from content and place in array
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  let results = script('MacOs', 'Shell', JSON.parse(values));
  document.getElementById('target').value = _.join(results, '\n');
};

function downloadFileName(elemId){
  switch (elemId) {
    case 'target': return 'setup.sh';
    case 'source': return 'source.json';
    default: return '';
  }
}

//=================================================================
var timeout = null;
function checkEditCompleteThenScript() {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    scriptSourceToTarget();
  }, 500);
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

function loadJSON(uri, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', uri, true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "404") {
          alert(`${uri} not found, try again.`)
        }
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
  };
  xobj.send(null);
}