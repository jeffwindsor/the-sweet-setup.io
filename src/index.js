/**************************************************************
  EVENT HANDLERS
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

function add(type) {
  switch (type) {
    case 'comment': addToSource({ type: 'comment', comment: 'comment' }); break;
    case 'echo': addToSource({ type: 'echo', message: 'message' }); break;
    case 'variable': addToSource({ type: 'variable', name: 'name', value: 'variable' }); break;
    case 'pacman': addToSource({ type: 'pacman', package_name: 'package' }); break;
    case 'yay': addToSource({ type: 'yay', package_name: 'package' }); break;
    case 'brew': addToSource({ type: 'brew', package_name: 'package' }); break;
    case 'cask': addToSource({ type: 'cask', package_name: 'package' }); break;
    case 'npm': addToSource({ type: 'npm', package_name: 'package' }); break;
    case 'code': addToSource({ type: 'code', extension_name: 'extension' }); break;
    case 'stack': addToSource({ type: 'stack', package_name: 'package' }); break;
    case 'file': addToSource({ type: 'file', content: 'content', target: { operator: 'redirect', path: 'path' } }); break;
    case 'gitconfig': addToSource({ type: 'gitconfig', name: 'name', value: 'value' }); break;
    case 'gitclone': addToSource({ type: 'gitclone', uri: 'uri', args: 'args', output_dir: 'dir' }); break;
    case 'curl': addToSource({ type: 'curl', uri: 'uri', args: 'args', target: { operator: 'redirect', path: 'path' } }); break;

    default:
      break;
  }
}

function addPackage(name) {
  addToSource(eval(name));
}

function addPackageFromFile(jsonFile) {
  loadJSON(jsonFile, function(response) {
   // Parse JSON string into object
    alert(response);
    var json = JSON.parse(response);
    alert(json);
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

function loadJSON(jsonFile, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', `https://jeffwindsor.github.io/the-sweet-setup.io/data/${jsonFile}.json`, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        alert(xobj.readyState + " " + xobj.status )
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null); 
  alert(complete); 
}