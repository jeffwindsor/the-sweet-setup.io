import targetOperatorResolver from './targetOperator'

export default function(o){
  var result = `echo -e "function ${o.name}(){ 
  ${o.value} 
}" `
  if(o.target != null) {
    result += ` ${targetOperatorResolver(o.target.operator)} ${o.target.path}`;
  }
  return result;
}