function addLineToSource(type, name, value, targetOperator, targetPath){
  var text = `{"type":"${type}", "name":"${name}"`;
  if(value != null){ text += `, "value":"${value}"`; }
  if(targetOperator != null && targetPath != null){ text += `, target:{"operator": "${targetOperator}", "path":"${targetPath}"`; }
  text += "},\n"
  document.getElementById("source").value += text;
}
function addFunctionPackage(name){ addLineToSource("FunctionPackageAsFish", name, null, "RedirectOutputAppend", "/user/home/.fishrc"); }
function add(type){
  switch (type) {
    case 'Comment': addLineToSource("Comment", "comment"); break;
    case 'Info': addLineToSource("Info", "text"); break;
    case 'Variable': addLineToSource("Variable", "varName", "varValue"); break;
    case 'ArchPackage': addLineToSource("ArchPackage", "packageName"); break;
  
    default:
      break;
  }
}

function scriptSource() {
  let input = document.getElementById("source").value.trim();
  let values = "[" + ( (input.slice(-1)==',') ? input.slice(0,-1) : input) + "]";
  let results = script("MacOs","Shell", JSON.parse(values));
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