
/**************************************************************
  SOURCE HELPERS
**************************************************************/
// ?  ADD ABILITY TO PULL IN PACKAGE FILE FROM LOCAL OR URI

function addFunctionPackage(name) {
  addLineToSource("FunctionPackageAsFish", name, null, "RedirectOutputAppend", "/user/home/.fishrc");
}
function add(type) {
  switch (type) {
    case 'Comment': addLineToSource("Comment", "comment"); break;
    case 'Info': addLineToSource("Info", "text"); break;
    case 'Variable': addLineToSource("Variable", "var_name", "var_value"); break;
    case 'ArchPackage': addLineToSource("ArchPackage", "packageName"); break;
    case 'YayPackage': addLineToSource("YayPackage", "packageName"); break;
    case 'BrewPackage': addLineToSource("BrewPackage", "packageName"); break;
    case 'CaskPackage': addLineToSource("CaskPackage", "packageName"); break;
    case 'NpmPackage': addLineToSource("NpmPackage", "packageName"); break;
    case 'VsCodeExtension': addLineToSource("VsCodeExtension", "ext.name"); break;
    case 'HaskellStackInstall': addLineToSource("HaskellStackInstall", "packageName"); break;

    case 'WriteToFile': addLineToSource("WriteToFile", "comment", "content_to_write", "Write", ""); break;
    case 'GitGlobal': addLineToSource("GitGlobal", "packageName"); break;
    case 'GitClone': addLineToSource("GitClone", "packageName"); break;
    case 'Curl': addLineToSource("Curl", "packageName"); break;

    default:
      break;
  }
}
function addLineToSource(type, name, value, targetOperator, targetPath) {
  var text = `{"type":"${type}", "name":"${name}"`;
  if (value != null) { text += `, "value":"${value}"`; }
  if (targetOperator != null && targetPath != null) { text += `, target:{"operator": "${targetOperator}", "path":"${targetPath}"`; }
  text += "},\n"
  document.getElementById("source").value += text;
}

/**************************************************************
  SCRIPTING HELPERS
**************************************************************/
function scriptSource() {
  let input = document.getElementById("source").value.trim();
  let values = "[" + ((input.slice(-1) == ',') ? input.slice(0, -1) : input) + "]";
  let results = script("MacOs", "Shell", JSON.parse(values));
  document.getElementById("target").value = _.join(results, "\n");
}

function downloadTarget() {
  let data = document.getElementById("target").value;

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', 'yourSweetSetup.sh');
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}