# 🕸️ Simple Web Crawler

A simple web crawler that crawls a given website and discovers all the pages linked within the same website domain. The output of the crawl, in a text format, displays all the paths visited under the same domain, and a list of links and images found on each page. The crawler does not follow any links to external websites other than the same domain specified as a starting point.

## 🏗️ Build

To build the project, the following requisites are required.

- NodeJS 14.15.0
  - Download at [Node.js official website](https://nodejs.org/)
  - Code written and tested with this version so can't guarantee it will run on lower or higher versions

### Build it!

Make sure you have Node.js installed by typing `node --version`

Open a terminal and in the root of the project where package.json resides, type:

```
npm install
```

The command above will download the project dependencies from the internet and install them locally. Make sure there are no errors before continuing.

## 🧪 Test

Run the unit tests in the project to make sure they pass. It is always a good idea to make sure before running the application.

```
npm test
```

## 🕹️ Run

The web crawler has a command line interface and to run it, you would run the CLI script via `node` command.

```
node src/cli.js
```

The script has 1 required argument and if you run it without specifying any argument, it will display the usage help.

```
Usage: cli.js <domain>
  Example: cli.js www.example.com
  Note: the crawler will crawl the domain using https
```

**Note:** Please do not specify a URL for the domain. The domain should not begin with http or https. At this time, only https protocol is supported, and custom ports are not supported yet. Domain redirects (301) are ignored so make sure you specify the final destination for the domain name in order for the crawler to fetch correctly.
