import { script } from '../../src/resolvers'

test('scripting a ', () => {
  let actual = script('MacOs','Shell',[{type:'Comment', name:'name', value:'value'}])
  expect(actual).toBe('#value');
});