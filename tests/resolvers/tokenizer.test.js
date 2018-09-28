import { tokenizeShellHeader } from '../../src/resolvers/tokenize'

test('tokenizeShellHeader', () => {
  let actual = tokenizeShellHeader('MacOs','Shell')
  expect(actual).toEqual({"type": "Comment", "name": "!/bin/sh"});
});