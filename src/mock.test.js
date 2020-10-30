const { expect, test } = require('@jest/globals')
const { htmlSnippet, fetchPage } = require('./mock')
const {
  parseDocumentForAnchorTags,
  parseDocumentForImageTags,
  fetchAndCreatePage,
  crawler
} = require('./')

test('parses a html snippet with 5 anchor tags', () => {
  const hrefs = parseDocumentForAnchorTags(htmlSnippet())
  expect(hrefs.length).toEqual(5)
})

test('parses a html snippet with 2 image tags', () => {
  const images = parseDocumentForImageTags(htmlSnippet())
  expect(images.length).toEqual(2)
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

test('fetch url and create a Page object', async () => {
  const hostname = 'www.google.com'
  const path = '/'

  const testPage = await fetchAndCreatePage(fetchPage, hostname, path)

  expect(testPage).toBeTruthy()
  expect(testPage.hostname).toEqual(hostname)
  expect(testPage.path).toEqual(path)
  expect(testPage.fetched).toBeTruthy()
  expect(testPage.fetchStatus).toEqual(200)
  expect(testPage.internalLinks.size).toEqual(5)
  expect(testPage.externalLinks.size).toEqual(0)
  expect(testPage.imageLinks.size).toEqual(2)
})

test('crawler with fake fetcher should return 17 entries', async () => {
  const hostname = 'www.google.com'

  const crawlMap = await crawler(hostname, fetchPage)

  expect(crawlMap.size).toEqual(17) // there are 17 unique urls in the fake fetcher

  expect(crawlMap.has('/a112')).toBeTruthy()

  const pageForA112 = crawlMap.get('/a112')
  expect(pageForA112.fetched).toBeTruthy()
  expect(pageForA112.fetchStatus).toEqual(200)

  expect(pageForA112.internalLinks.size).toEqual(2)
  expect(pageForA112.internalLinks).toContain('/a1121')
  expect(pageForA112.internalLinks).toContain('/b')

  expect(pageForA112.externalLinks.size).toEqual(1)
  expect(pageForA112.externalLinks).toContain('https://twitter.com')

  expect(pageForA112.imageLinks.size).toEqual(0)
})
