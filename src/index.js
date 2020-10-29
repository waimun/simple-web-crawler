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

const pageFromDocument = (hostname, path, document) => {
  const anchorTags = parseDocumentForAnchorTags(document)
  const internalLinks = anchorTags.filter(element => isInternalLink(hostname, element))
  const page = createPage({ hostname, path })
  page.addInternalLinks(internalLinks)
  return page
}

const fetchAndCreatePage = async (fetcher, hostname, path = '/') => {
  const { status, document } = await fetcher(hostname, path)

  if (status === 200) {
    const page = pageFromDocument(hostname, path, document)
    page.fetchStatus = status
    page.fetched = true
    return page
  }

  return createPage({ hostname, path, fetched: true, fetchStatus: status })
}

const unfetchedPagesFrom = map => {
  return [...map.entries()].filter(([k, v]) => v.fetched === false)
}

const updateMapWithFetchedResults = (crawlMap, results) => {
  for (const result of results) {
    const { status, value } = result

    if (status === 'fulfilled') {
      crawlMap.set(value.path, value)

      for (const link of value.internalLinks) {
        if (!crawlMap.has(link)) {
          crawlMap.set(link, createPage({ hostname: value.hostname, path: link }))
        }
      }
    }
  }
}

const crawler = async (hostname, fetcher) => {
  const crawlMap = new Map()
  const rootPath = '/'

  const startPage = createPage({ hostname, rootPath })
  crawlMap.set(rootPath, startPage)

  while (unfetchedPagesFrom(crawlMap).length > 0) {
    const unfetched = unfetchedPagesFrom(crawlMap)
    const promises = unfetched.map(([path]) => fetchAndCreatePage(fetcher, hostname, path))
    const results = await Promise.allSettled(promises)
    updateMapWithFetchedResults(crawlMap, results)
  }

  return crawlMap
}

exports.parseDocumentForAnchorTags = parseDocumentForAnchorTags
exports.isInternalLink = isInternalLink
exports.createPage = createPage
exports.pageFromDocument = pageFromDocument
exports.fetchAndCreatePage = fetchAndCreatePage
exports.crawler = crawler
