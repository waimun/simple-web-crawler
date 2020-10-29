const { expect, test } = require('@jest/globals')
const { htmlSnippet, fetchPage } = require('./mock')
const { parseDocumentForAnchorTags, fetchAndCreatePage } = require('./')

test('prints a html snippet', () => {
  expect(htmlSnippet()).toBeTruthy()
  console.log(htmlSnippet())
})

test('parses a html snippet with 5 anchor tags', () => {
  const hrefs = parseDocumentForAnchorTags(htmlSnippet())
  expect(hrefs.length).toEqual(5)
})

test('mocks fetching a page with default root path', async () => {
  const hostname = 'www.google.com'
  const fetchResult = await fetchPage(hostname)

  expect(fetchResult).toBeTruthy()
  expect(fetchResult.status).toEqual(200)

  const document = fetchResult.document
  expect(document).toBeTruthy()

  const hrefs = parseDocumentForAnchorTags(document)
  expect(hrefs.length).toEqual(5)
})

test('mocks fetching a page with another path', async () => {
  const hostname = 'www.google.com'
  const path = '/b'

  const fetchResult = await fetchPage(hostname, path)

  expect(fetchResult).toBeTruthy()
  expect(fetchResult.status).toEqual(200)

  const document = fetchResult.document
  expect(document).toBeTruthy()

  const hrefs = parseDocumentForAnchorTags(document)
  expect(hrefs.length).toEqual(3)
  expect(hrefs).toContain('/b1')
  expect(hrefs).toContain('/b2')
  expect(hrefs).toContain('/')
})

test('mocks fetching a page that returns no links', async () => {
  const hostname = 'www.google.com'
  const path = '/d'

  const fetchResult = await fetchPage(hostname, path)

  expect(fetchResult).toBeTruthy()
  expect(fetchResult.status).toEqual(200)

  const document = fetchResult.document
  expect(document).toBeTruthy()

  const hrefs = parseDocumentForAnchorTags(document)
  expect(hrefs.length).toEqual(0)
})

test('mocks fetching a 404 page', async () => {
  const hostname = 'www.google.com'
  const path = '/notfound'

  const fetchResult = await fetchPage(hostname, path)

  expect(fetchResult).toBeTruthy()
  expect(fetchResult.status).toEqual(404)

  const document = fetchResult.document

  const hrefs = parseDocumentForAnchorTags(document)
  expect(hrefs.length).toEqual(0)
})

test('fetching a page fails with an error', async () => {
  expect.assertions(1)

  try {
    await fetchPage() // no hostname provided
  } catch (e) {
    expect(e.message).toMatch('missing hostname')
  }
})

test('fetch url and create a page object', async () => {
  const hostname = 'www.google.com'
  const path = '/'

  const testPage = await fetchAndCreatePage(fetchPage, hostname, path)

  expect(testPage).toBeTruthy()
  expect(testPage.hostname).toEqual(hostname)
  expect(testPage.path).toEqual(path)
  expect(testPage.fetched).toBeTruthy()
  expect(testPage.fetchStatus).toEqual(200)
  expect(testPage.internalLinks.size).toEqual(5)
})
