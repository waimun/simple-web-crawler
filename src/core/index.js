const { parseDocumentForAnchorTags, isInternalLink, parseDocumentForImageTags } = require('../parser')
const { createPage } = require('../models')

const pageFromDocument = (hostname, path, document) => {
  const anchorTags = parseDocumentForAnchorTags(document)

  const internalLinks = []
  const externalLinks = []
  anchorTags.forEach(anchor => isInternalLink(hostname, anchor) ? internalLinks.push(anchor) : externalLinks.push(anchor))

  const imageTags = parseDocumentForImageTags(document)

  const page = createPage({ hostname, path })
  page.addInternalLinks(internalLinks)
  page.addExternalLinks(externalLinks)
  page.addImageLinks(imageTags)

  return page
}

const fetchAndCreatePage = async (fetcher, hostname, path = '/') => {
  try {
    const { status, document } = await fetcher(hostname, path)

    if (status === 200) {
      const page = pageFromDocument(hostname, path, document)
      page.fetchStatus = status
      page.fetched = true
      return page
    }

    return createPage({ hostname, path, fetched: true, fetchStatus: status })
  } catch (e) {
    // fetcher internal error
    return createPage({ hostname, path, fetched: true }) // undefined fetchStatus
  }
}

exports.pageFromDocument = pageFromDocument
exports.fetchAndCreatePage = fetchAndCreatePage
