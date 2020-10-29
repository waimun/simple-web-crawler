const { expect, test } = require('@jest/globals')
const { htmlSnippet } = require('./mock')
const { parseDocumentForAnchorTags } = require('./')

test('prints a html snippet', () => {
  expect(htmlSnippet()).toBeTruthy()
  console.log(htmlSnippet())
})

test('parses a html snippet with 5 anchor tags', () => {
  const hrefs = parseDocumentForAnchorTags(htmlSnippet())
  expect(hrefs.length).toEqual(5)
})
