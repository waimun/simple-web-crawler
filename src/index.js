const parseDocumentForAnchorTags = html => {
  const HTMLParser = require('node-html-parser')
  const root = HTMLParser.parse(html)

  const anchors = root.querySelectorAll('a')
  return anchors.map(anchor => anchor.getAttribute('href'))
}

const isInternalLink = (hostname, path) => {
  if (hostname === undefined || hostname === null) return false
  if (path === undefined || path === null) return false
  if (path.startsWith(`https://${hostname}`)) return true
  if (path.startsWith('/')) return true
  return false
}

const createPage = ({ hostname, path = '/', fetched = false, fetchStatus, internalLinks = new Set() }) => {
  return {
    hostname,
    path,
    fetched,
    fetchStatus,
    internalLinks,
    addInternalLinks (links) {
      links.forEach(link => this.internalLinks.add(link))
    }
  }
}

exports.parseDocumentForAnchorTags = parseDocumentForAnchorTags
exports.isInternalLink = isInternalLink
exports.createPage = createPage
