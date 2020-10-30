const { expect, test } = require('@jest/globals')
const {
  isInternalLink,
  removeHostnameFromLink,
  removeHashFragmentFromLink,
  createPage,
  pageFromDocument
} = require('./')
const { htmlSnippet } = require('./mock')

test('if a link is internal', () => {
  const relativeLink = '/a'
  const linkWithHostname = 'https://www.google.com'
  const hostname = 'www.google.com'

  expect(isInternalLink(hostname, relativeLink)).toBeTruthy()
  expect(isInternalLink(hostname, linkWithHostname)).toBeTruthy()
  expect(isInternalLink(undefined, relativeLink)).toBeFalsy()
  expect(isInternalLink(null, relativeLink)).toBeFalsy()
  expect(isInternalLink(hostname, undefined)).toBeFalsy()
  expect(isInternalLink(hostname, null)).toBeFalsy()
  expect(isInternalLink()).toBeFalsy()
  // this test is not extensive or thorough but good enough for the use cases I require
})

test('if a link is external', () => {
  const linkWithAnotherHostname = 'https://www.twitter.com'
  const hostname = 'www.google.com'

  expect(isInternalLink(hostname, linkWithAnotherHostname)).toBeFalsy()
})

test('remove hostname from a link', () => {
  const hostname = 'www.google.com'
  const path = '/hello'
  const linkWithHostname = `https://${hostname}${path}`

  const result = removeHostnameFromLink(hostname, linkWithHostname)
  expect(result).toEqual(path)

  const anotherHostname = 'www.twitter.com'

  const anotherResult = removeHostnameFromLink(anotherHostname, linkWithHostname)
  expect(anotherResult).toEqual(linkWithHostname) // hostname has to match in order to remove
})

test('remove hash fragment from a link', () => {
  const hostname = 'www.google.com'
  const path = '/hello'
  const hash = '#world'
  const linkWithHash = `https://${hostname}${path}${hash}`

  const result = removeHashFragmentFromLink(linkWithHash)
  expect(result).toEqual(`https://${hostname}${path}`)
})

test('creates a Page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  expect(testPage.hostname).toEqual(props.hostname)
  expect(testPage.path).toEqual('/')
  expect(testPage.fetched).toBeFalsy()
  expect(testPage.fetchStatus).toBeUndefined()
  expect(testPage.internalLinks.size).toEqual(0)
  expect(testPage.externalLinks.size).toEqual(0)
  expect(testPage.imageLinks.size).toEqual(0)
})

test('adds internal links to a Page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  const links = ['/a', '/b', '/c']
  testPage.addInternalLinks(links)

  expect(testPage.internalLinks.size).toEqual(3)
})

test('adds external links to a Page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  const links = ['https://twitter.com', 'https://www.facebook.com/', 'https://www.microsoft.com']
  testPage.addExternalLinks(links)

  expect(testPage.externalLinks.size).toEqual(3)
})

test('adds images to a Page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  const images = [['/images/foo.png', 'Foo Image'], ['/images/bar.png', 'Bar Image']]
  testPage.addImageLinks(images)

  expect(testPage.imageLinks.size).toEqual(2)
})

test('creates a Page object from a document', () => {
  const hostname = 'www.google.com'
  const path = '/'
  const document = htmlSnippet()

  const testPage = pageFromDocument(hostname, path, document)

  expect(testPage).toBeTruthy()
  expect(testPage.hostname).toEqual(hostname)
  expect(testPage.path).toEqual(path)
  expect(testPage.fetched).toBeFalsy()
  expect(testPage.fetchStatus).toBeUndefined()
  expect(testPage.internalLinks.size).toEqual(5)
  expect(testPage.externalLinks.size).toEqual(0)
  expect(testPage.imageLinks.size).toEqual(2)
})
