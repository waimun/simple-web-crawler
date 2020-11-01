const { removeHostnameFromLink, removeHashFragmentFromLink } = require('../parser')

const createPage = ({ hostname, path = '/', fetched = false, fetchStatus }) => {
  const internalLinks = new Set()
  const externalLinks = new Set()
  const imageLinks = new Map()

  return {
    hostname,
    path,
    fetched,
    fetchStatus,
    internalLinks,
    externalLinks,
    imageLinks,
    addInternalLinks (links) {
      links.forEach(link => {
        const sanitized = removeHashFragmentFromLink(removeHostnameFromLink(hostname, link))
        this.internalLinks.add(sanitized)
      })
    },
    addExternalLinks (links) {
      links.forEach(link => this.externalLinks.add(link))
    },
    addImageLinks (links) {
      links.forEach(link => {
        const [src, alt] = link
        this.imageLinks.set(src, alt)
      })
    }
  }
}

exports.createPage = createPage
