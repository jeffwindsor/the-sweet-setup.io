import { script } from '../../src/resolvers/script'

test('scripting a comment', () => {
  let actual = script('MacOs','Shell',[{type:'Comment', name:'name', value:'value'}])
  expect(actual).toBe(['#value']);
});