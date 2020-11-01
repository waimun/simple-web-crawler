const HTMLParser = require('node-html-parser')

const parseDocumentForAnchorTags = html => {
  const root = HTMLParser.parse(html)

  const anchors = root.querySelectorAll('a')
  return anchors.map(anchor => anchor.getAttribute('href'))
}

const parseDocumentForImageTags = html => {
  const root = HTMLParser.parse(html)

  const images = root.querySelectorAll('img')
  return images.map(image => [image.getAttribute('src'), image.getAttribute('alt')])
}

const isInternalLink = (hostname, path) => {
  if (hostname === undefined || hostname === null) return false
  if (path === undefined || path === null) return false
  if (path.startsWith(`https://${hostname}`)) return true
  return path.startsWith('/')
}

const removeHostnameFromLink = (hostname, link) => {
  const baseUrl = `https://${hostname}`
  return (link === baseUrl) ? '/' : link.replace(baseUrl, '')
}

const removeHashFragmentFromLink = link => {
  const pos = link.indexOf('#')
  return (pos === -1) ? link : link.slice(0, pos)
}

exports.parseDocumentForAnchorTags = parseDocumentForAnchorTags
exports.parseDocumentForImageTags = parseDocumentForImageTags
exports.isInternalLink = isInternalLink
exports.removeHostnameFromLink = removeHostnameFromLink
exports.removeHashFragmentFromLink = removeHashFragmentFromLink
