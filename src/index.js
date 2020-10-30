const parseDocumentForAnchorTags = html => {
  const HTMLParser = require('node-html-parser')
  const root = HTMLParser.parse(html)

  const anchors = root.querySelectorAll('a')
  return anchors.map(anchor => anchor.getAttribute('href'))
}

const parseDocumentForImageTags = html => {
  const HTMLParser = require('node-html-parser')
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

const createPage = ({ hostname, path = '/', fetched = false, fetchStatus }) => {
  const internalLinks = new Set()
  const imageLinks = new Map()

  return {
    hostname,
    path,
    fetched,
    fetchStatus,
    internalLinks,
    imageLinks,
    addInternalLinks (links) {
      links.forEach(link => {
        const sanitized = removeHashFragmentFromLink(removeHostnameFromLink(hostname, link))
        this.internalLinks.add(sanitized)
      })
    },
    addImageLinks (links) {
      links.forEach(link => {
        const [src, alt] = link
        this.imageLinks.set(src, alt)
      })
    }
  }
}

const pageFromDocument = (hostname, path, document) => {
  const anchorTags = parseDocumentForAnchorTags(document)
  const internalLinks = anchorTags.filter(element => isInternalLink(hostname, element))

  const imageTags = parseDocumentForImageTags(document)

  const page = createPage({ hostname, path })
  page.addInternalLinks(internalLinks)
  page.addImageLinks(imageTags)

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
  return [...map.entries()].filter(([, v]) => v.fetched === false)
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

const printCrawlerOutput = crawlMap => {
  console.log('Crawler Output')
  console.log('--------------')
  crawlMap.forEach((value, key) => {
    console.log(`Path: ${key}`)
    console.log(`  Internal Links: ${value.internalLinks.size}`)
    for (const link of value.internalLinks) {
      console.log(`    ${link}`)
    }
    console.log('--------------')
  })
}

const fetchPage = async (hostname, path = '/') => {
  return new Promise((resolve, reject) => {
    if (hostname === undefined || hostname === null) reject(new Error('missing hostname'))

    const https = require('https')
    const options = {
      hostname: hostname,
      path: path.trim()
    }

    console.log(`fetching... ${options.path}`)

    const req = https.request(options, (res) => {
      let content = ''

      res.on('data', d => { content += d.toString() })
      res.on('end', () => resolve({ status: res.statusCode, document: content }))
    })

    req.on('error', e => {
      console.error(`error fetching... ${path}`)
      reject(e)
    })

    req.end()
  })
}

const runner = async (hostname, fetcher) => {
  const crawlMap = await crawler(hostname, fetcher)
  printCrawlerOutput(crawlMap)
}

exports.parseDocumentForAnchorTags = parseDocumentForAnchorTags
exports.parseDocumentForImageTags = parseDocumentForImageTags
exports.isInternalLink = isInternalLink
exports.removeHostnameFromLink = removeHostnameFromLink
exports.removeHashFragmentFromLink = removeHashFragmentFromLink
exports.createPage = createPage
exports.pageFromDocument = pageFromDocument
exports.fetchAndCreatePage = fetchAndCreatePage
exports.crawler = crawler
exports.printCrawlerOutput = printCrawlerOutput
exports.fetchPage = fetchPage
exports.runner = runner
