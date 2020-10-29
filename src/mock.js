const htmlSnippet = () => {
  return `
    <body>
      <a href="/a">A</a>
      <a href="/b">B</a>
      <a href="/c">C</a>
      <a href="/d">D</a>
      <a href="/e">E</a>
    </body>
  `
}

const fetchPage = async (hostname, path = '/') => {
  return new Promise((resolve, reject) => {
    if (hostname === undefined || hostname === null) reject(new Error('missing hostname'))

    resolve({ status: 200, document: htmlSnippet() })
  })
}

exports.htmlSnippet = htmlSnippet
exports.fetchPage = fetchPage
