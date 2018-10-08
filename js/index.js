function scriptSource() {
  //put input into an array
  let values = "[" + document.getElementById("source").value + "]";
  //call scripting function
  let results = script("MacOs","Shell", JSON.parse(values));
  //jon array of results with carrage return and place in target area
  document.getElementById("target").value = _.join(results, "\n");
}

// function downloadTarget(){
//   let data = document.getElementById("target").value;
//   function dataUrl(data) {return "data:x-application/text," + escape(data);}
//   window.open(dataUrl(data));
// }

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