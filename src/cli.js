const { runner, fetchPage } = require('./')

const commandArgs = process.argv.slice(2)

if (commandArgs.length === 0) {
  console.log(`Usage: cli.js <domain>
  Example: cli.js www.example.com
  Note: the crawler will crawl the domain using https`)

  process.exit(0)
}

const [domain] = commandArgs

runner(domain, fetchPage).then(console.log).catch(console.error)
