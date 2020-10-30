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
  const linkWithAnotherHostname = 'https://www.twitter.com'
  const hostname = 'www.google.com'

  expect(isInternalLink(hostname, relativeLink)).toBeTruthy()
  expect(isInternalLink(hostname, linkWithHostname)).toBeTruthy()
  expect(isInternalLink(hostname, linkWithAnotherHostname)).toBeFalsy()
  expect(isInternalLink(hostname, linkWithAnotherHostname)).toBeFalsy()
  expect(isInternalLink(undefined, relativeLink)).toBeFalsy()
  expect(isInternalLink(null, relativeLink)).toBeFalsy()
  expect(isInternalLink(hostname, undefined)).toBeFalsy()
  expect(isInternalLink(hostname, null)).toBeFalsy()
  expect(isInternalLink()).toBeFalsy()
  // this test is not extensive or thorough but good enough for the use cases I require
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

test('creates a page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  expect(testPage.hostname).toEqual(props.hostname)
  expect(testPage.path).toEqual('/')
  expect(testPage.fetched).toBeFalsy()
  expect(testPage.fetchStatus).toBeUndefined()
  expect(testPage.internalLinks.size).toEqual(0)
})

test('adds links to a page object', () => {
  const props = {
    hostname: 'www.google.com'
  }

  const testPage = createPage(props)

  const links = ['/a', '/b', '/c']
  testPage.addInternalLinks(links)

  expect(testPage.internalLinks.size).toEqual(3)
})

test('creates a page object from a document', () => {
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
})
