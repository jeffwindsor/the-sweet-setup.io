export default function(o){
  return `echo -e "\e[48;5;4m\e[38;5;4m$(seq -s '-' 1 $(tput cols) | tr -d '[:digit:]')\e[0m;"
echo -e "\e[38;5;250m \e[38;5;4m ${o.name} \e[0m";
echo -e;`;
}