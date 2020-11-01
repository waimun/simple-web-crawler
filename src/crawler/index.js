const { createPage } = require('../models')
const { fetchAndCreatePage } = require('../core')

const unfetchedPagesFrom = crawlMap => {
  return [...crawlMap.entries()].filter(([, v]) => v.fetched === false)
}

const updateMapWithFetchedResults = (crawlMap, results) => {
  for (const result of results) {
    const { value } = result

    crawlMap.set(value.path, value)

    for (const link of value.internalLinks) {
      if (!crawlMap.has(link)) {
        crawlMap.set(link, createPage({ hostname: value.hostname, path: link }))
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
  let output = ''
  const newLine = '\n'
  const lineSeparator = '\n--------------'

  output += newLine + 'Crawler Output'
  output += lineSeparator

  crawlMap.forEach((value, key) => {
    output += newLine + `Path: ${key}`

    output += newLine + `  Internal Links: ${value.internalLinks.size}`
    for (const link of value.internalLinks) {
      output += newLine + `    ${link}`
    }

    output += newLine + `  Image Links: ${value.imageLinks.size}`
    for (const image of value.imageLinks) {
      const [src, alt] = image
      output += newLine + `    [${alt}](${src})`
    }

    output += newLine + `  External Links: ${value.externalLinks.size}`
    for (const link of value.externalLinks) {
      output += newLine + `    ${link}`
    }

    output += lineSeparator
  })

  return output
}

const runner = async (hostname, fetcher) => {
  const crawlMap = await crawler(hostname, fetcher)
  return printCrawlerOutput(crawlMap)
}

exports.crawler = crawler
exports.printCrawlerOutput = printCrawlerOutput
exports.runner = runner
