const { expect, test } = require('@jest/globals')

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

test('prints a html snippet', () => {
  expect(htmlSnippet()).toBeTruthy()
  console.log(htmlSnippet())
})

test('parses a html snippet with 5 anchor tags', () => {
  const HTMLParser = require('node-html-parser')
  const root = HTMLParser.parse(htmlSnippet())
  const anchors = root.querySelectorAll('a')
  expect(anchors.length).toEqual(5)
})
