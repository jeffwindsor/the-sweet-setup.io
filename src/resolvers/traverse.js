import { tokenizeShellHeader, tokenizeBashFunction, tokenizeFishFunction, tokenizeList } from './tokenize'
function traverse(token) {
  switch (token.type) {
    case 'BashFunction': return tokenizeBashFunction(token);
    case 'FishFunction': return tokenizeFishFunction(token);
    case 'List': return tokenizeList(token);
    default: return token;
  }
}
export { traverse }