import targetOperatorResolver from './targetOperator'

export default function(o){
  var result ='curl';
  if(o.args != null) {
    result += ' ' + o.args;
  }
  result += ' ' + o.name
  if(o.target != null) {
    result += ' ' + targetOperatorResolver(o.target.operator) 
                  + ' ' + o.target.path;
  }
  return result;
}