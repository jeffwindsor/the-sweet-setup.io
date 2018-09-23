export default function(o){
  switch (o) {
    case "None" : return ""
    case "Pipe": return "|"
    case "RedirectOutput": return ">"
    case "RedirectOutputAppend": return ">>"
    default: return "???"
  }
}