import targetOperatorResolver from './targetOperator'

export default function(o){
  var result =`echo -e "function ${o.name} 
  ${o.value} 
end"`;
  if(o.target != null) {
    result += ` ${targetOperatorResolver(o.target.operator)} ${o.target.path}/${o.name}.fish`;
  }
  return result;
}