# 🕸️ Simple Web Crawler

A simple web crawler that crawls a given website and discovers all the pages linked within the same website domain.
The output of the crawl, in a text format, displays all the paths visited under the same domain, and a list of links
and images found on each page. The crawler does not follow any links to external websites other than the same domain
specified as a starting point.

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
decisions evolved from this model. You can create a Page object using the `createPage` factory function. Unit tests are
a good way to understand how it is used extensively.

The second object is the `crawlMap`. It is not really a custom data object. Practically, it is just a `Map` that is
used as an underlying data store to track the urls visited. The crawler uses the `Map` to iterate through the fetches.