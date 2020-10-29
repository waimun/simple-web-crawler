const { expect, test } = require('@jest/globals')
const { isInternalLink } = require('./')

test('tests to see if a link is internal', () => {
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
