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

const htmlSnippetA = () => {
  return `
    <body>
      <a href="/a1">A1</a>
      <a href="/a2">A2</a>
      <a href="/a3">A3</a>
    </body>
  `
}

const htmlSnippetA1 = () => {
  return `
    <body>
      <a href="/a11">A11</a>
      <a href="/a12">A12</a>
    </body>
  `
}

const htmlSnippetA11 = () => {
  return `
    <body>
      <a href="/a111">A111</a>
      <a href="/a112">A112</a>
      <a href="/c">C</a>
    </body>
  `
}

const htmlSnippetA112 = () => {
  return `
    <body>
      <a href="/a1121">A1121</a>
      <a href="/b">B</a>
    </body>
  `
}

const htmlSnippetB = () => {
  return `
    <body>
      <a href="/b1">B1</a>
      <a href="/b2">B2</a>
      <a href="/">/</a>
    </body>
  `
}

const htmlSnippetC = () => {
  return `
    <body>
      <a href="/c1">C1</a>
      <a href="/a">A</a>
    </body>
  `
}

const htmlSnippetD = () => {
  return `
    <body>
      <p>no links</p>
    </body>
  `
}

const htmlSnippetE = () => {
  return `
    <body>
      <p>no links</p>
    </body>
  `
}

const fetchPage = async (hostname, path = '/') => {
  return new Promise((resolve, reject) => {
    if (hostname === undefined || hostname === null) reject(new Error('missing hostname'))

    switch (path) {
      case '/':
        resolve({ status: 200, document: htmlSnippet() })
        return
      case '/a':
        resolve({ status: 200, document: htmlSnippetA() })
        return
      case '/a1':
        resolve({ status: 200, document: htmlSnippetA1() })
        return
      case '/a11':
        resolve({ status: 200, document: htmlSnippetA11() })
        return
      case '/a112':
        resolve({ status: 200, document: htmlSnippetA112() })
        return
      case '/b':
        resolve({ status: 200, document: htmlSnippetB() })
        return
      case '/c':
        resolve({ status: 200, document: htmlSnippetC() })
        return
      case '/d':
        resolve({ status: 200, document: htmlSnippetD() })
        return
      case '/e':
        resolve({ status: 200, document: htmlSnippetE() })
        return
      default:
        resolve({ status: 404, document: '' })
    }
  })
}

exports.htmlSnippet = htmlSnippet
exports.fetchPage = fetchPage
