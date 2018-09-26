const _join = require('lodash/join');
const _flatMap = require('lodash/flatMap');

// Function to expand, convert, modify and populate new fragments based on input
function traverse(fragment) {
  console.log(fragment);
  switch (fragment.type) {
    case 'BashFunction':
      // Add function syntax and convert to WriteToFile type
      return newFragment('WriteToFile', fragment.name,
        joinNewLine(`function ${fragment.name}(){`, fragment.value, `}`),
        'RedirectOutputAppend', fragment.target.path);

    case 'FishFunction':
      // Add function syntax and convert to WriteToFile type
      return newFragment('WriteToFile', fragment.name,
        joinNewLine(`function ${fragment.name}`, fragment.value, `end`),
        'RedirectOutput', `${fragment.target.path}/${fragment.name}.fish`);

    case 'List':
      // Traverse new fragments prior to returning
      return _flatMap(lookUpList(fragment.name, fragment.target), traverse);

    default:
      return fragment;
  }
}

function newFragment(type, name, value, operator, path) {
  return { type: type, name: name, value: value, target: newTarget(operator, path) };
}
function newTarget(operator, path){
  return (operator == null && path == null) ? null : { operator: operator, path: path };
}
function lookUpList(listName, target){
  let fragments = require(`./lists/${listName.toLowerCase()}.json`);
  if(target != null)
  {
    fragments.forEach(f => f.target = target);
  }
  return fragments;
}
function joinNewLine(...fragments) { return _join(fragments, '\n'); }

export { traverse }