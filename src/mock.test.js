const { expect, test } = require('@jest/globals')
const { htmlSnippet, fetchPage } = require('./mock')
const { parseDocumentForAnchorTags } = require('./')

test('prints a html snippet', () => {
  expect(htmlSnippet()).toBeTruthy()
  console.log(htmlSnippet())
})

test('parses a html snippet with 5 anchor tags', () => {
  const hrefs = parseDocumentForAnchorTags(htmlSnippet())
  expect(hrefs.length).toEqual(5)
})

test('mocks fetching a page', async () => {
  const hostname = 'www.google.com'
  const fetchResult = await fetchPage(hostname)

  expect(fetchResult).toBeTruthy()
  expect(fetchResult.status).toEqual(200)

  const document = fetchResult.document
  expect(document).toBeTruthy()

  const hrefs = parseDocumentForAnchorTags(document)
  expect(hrefs.length).toEqual(5)
})

test('fetching a page fails with an error', async () => {
  expect.assertions(1)

  try {
    await fetchPage() // no hostname provided
  } catch (e) {
    expect(e.message).toMatch('missing hostname')
  }
})
