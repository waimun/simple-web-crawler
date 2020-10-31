# 🕸️ Simple Web Crawler

A simple web crawler that crawls a given website and discovers all the pages linked within the same website domain.
The output of the crawl, in a text format, displays all the paths visited under the same domain, and a list of links
and images found on each page. The crawler does not follow any links to external websites other than the same domain
specified as a starting point.

This project should not be used in a production environment. There are some missing features before it can be more
robust and production-ready.

## 🏗️ Build

To build the project, the following are the requisites.

- Node.js 14.15.0
  - Download at [Node.js official website](https://nodejs.org/)
  - Code written and tested with this version so can't guarantee it will run on lower or higher versions

### Build it!

Make sure you have Node.js installed by typing `node --version`

Open a terminal and in the root of the project where package.json resides, type:

```
npm install
```

`npm install` will download the project dependencies from the internet and install them locally. Make sure there
are no errors before continuing.

## 🧪 Test

Run the unit tests in the project to make sure they pass all the time. It is always a good idea to make sure before
running the application.

```
npm test
```

## 🕹️ Run

The web crawler has a command line interface and to run it, you would run the CLI script (cli.js) via `node` command.

```
node src/cli.js
```

The CLI script has 1 required argument and if you run it without specifying any arguments, it will display the usage
help.

```
Usage: cli.js <domain>
  Example: cli.js www.example.com
  Note: the crawler will crawl the domain using https
```

**Note:** Please do not specify a URL for the `domain` argument. The domain should not begin with http or https. At
this time, the web crawler only supports https protocol, and do not support custom ports yet. Domain redirects (301)
are ignored so please make sure you specify the final destination for the domain name in order for the crawler to
fetch correctly.

## ⚒️ Design

#### HTML parser

In order to find links and images on a webpage, the HTML content served from a web server has to be parsed to look for
`<a>` and `<img>` elements. Parsing the content by hand is a less efficient, time-consuming, and tedious task. There
are html parsers that are efficient, performant and well maintained. I have chosen `node-html-parser` for this.

#### Links and images

The crawler identifies links and images on a webpage by searching for `<a>` and `<img>` tags respectively. It does
not consider other html tags or technical approaches that may be used to display links or images.

#### Unit tests

To understand how the crawler works, start by looking at `mock.test.js` and then `index.test.js`. The mock file
contains functions that begin with the assumption of creating small chunks of static html content with some text,
links, and images. These functions deal with parsing content and validating links. A fake fetcher returns html content
with a hierarchy of pages that can be possibly fetched.

The index test file contains unit tests that normally do not require the sample data from the mock file. All the unit
tests execute fast because they do not depend on any side effects or network.

#### Data model

The `Page` object is the most important piece of data that the crawler interacts with most. Most of the design making
decisions evolved from this model. You can create a Page object using the `createPage` factory function. Unit tests
are a good way to understand how it is used extensively.

The second object is the `crawlMap`. It is not really a custom data object. Practically, it is just a `Map` that is
used as an underlying data store to track the urls visited. The crawler uses the `Map` to iterate through the fetches.

#### Functions

Functions-first by choice. I have used only functions to implement the basic requirements I have put together in this
project. There are no classes to instantiate and JS does not support interfaces. There are no types either so code
needs to be simple, readable and expressive.

One notable function is `fetchAndCreatePage`. It is an important function that orchestrates work among other helper
functions to fetch webpages, parse html content and transfer data to the data model. Worthwhile to take a closer look
as the `crawler` function uses it. The `fetchAndCreatePage` function requires a fetcher function to operate. You can
swap different implementations of the fetcher as we saw an example of the fake fetcher.

The `crawler` function is the main driver to the web crawler operation. It encapsulates the `crawlMap` as the
underlying in-memory data store.

#### Command line interface (CLI)

The web crawler is available as a CLI. The `cli.js` script invokes it. This script provides basic command line usage
and passes the user supplied argument to the `runner` function to run. It prints the output of the crawler results
on the console.

#### Tradeoffs

While working on the project, I have to make some tradeoffs or priorities. They are listed below.

- Process only http status 200 that are returned from documents
- Store url as key in the `Map`
- No retries for failed requests
- Not keeping track of failed requests
- Handle urls with query parameters which are dynamic (server-side rendered)
- Potentially not handling cyclic requests based on the above
- Works better on webpages that are static or file-based
- Memory limitation
- Single worker (not distributed)
- HTTPS only
- Little validation on function inputs (assume inputs are correct)

#### With more time

I would like to accomplish the following.

- [ ] Validation of function parameters
- [ ] Support redirects
- [ ] Support retries
- [ ] Handle cyclic requests
- [ ] Create docker container for the app
- [ ] Continuous integration
- [ ] Provide stats (number of pass/fail, time elapsed, etc) in the crawl's output
- [ ] Improve the format of the crawl's output
- [ ] Accept url as a starting point (nice to have)
- [ ] Support http (lower priority)
- [ ] Support custom ports (if necessary)
