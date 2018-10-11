/**************************************************************
  EVENT HANDLERS
**************************************************************/
var timeout = null;
function checkEditCompleteThenScript() {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    scriptSource();
  }, 500);
};

function scriptSource() {
  let input = document.getElementById('source').value.trim();
  let values = '[' + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + ']';
  let results = script('MacOs', 'Shell', JSON.parse(values));
  document.getElementById('target').value = _.join(results, '\n');
  isTargetEmpty(false);
};

function clearSourceAndTarget() {
  document.getElementById('source').value = '';
  document.getElementById('target').value = '';
  isTargetEmpty(true);
};

function copyTargetContent() {
  var copyText = document.getElementById("target");
  copyText.select();
  document.execCommand("copy");
};

function downloadTarget() {
  let data = document.getElementById('target').value;

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', 'yourSweetSetup.sh');
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// ?  ADD ABILITY TO PULL IN PACKAGE FILE FROM LOCAL OR URI
function addToSource(addition) {
  let add = JSON.stringify(addition, undefined, 2) + ',\n';
  document.getElementById('source').value += add;
  scriptSource();
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

function isTargetEmpty(bool){
  let d = document.getElementById('download').classList;
  let c = document.getElementById('copy').classList;
  if(bool)
  {
    d.add('disabled');
    c.add('disabled');
  }
  else
  {
    d.remove('disabled');
    c.remove('disabled');
  }
}