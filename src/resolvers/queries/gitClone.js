export default function(o){
  var result ='git clone ' + o.name;
  if(o.target != null) {
    result += ' "' + o.target.path + '"';
  }
  if(o.args != null) {
    result += ' ' + o.args;
  }
  return result;
}