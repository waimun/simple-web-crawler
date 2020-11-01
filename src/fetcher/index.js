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

exports.fetchPage = fetchPage
