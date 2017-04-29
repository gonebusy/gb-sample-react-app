[![Build Status](https://travis-ci.org/gonebusy/sample-react-app.svg?branch=master)](https://travis-ci.org/gonebusy/sample-react-app)

--

# Gonebusy Sample React App

This is a sample React app that demonstrates how to incorporate the [gonebusy-nodejs-sdk](https://github.com/gonebusy/gonebusy-nodejs-client) into a smooth UX for booking.

## Prerequisites

* Node 5, Node 6
* [Signup](https://beta.gonebusy.com/login) with Gonebusy and obtain your API token.
* [yarn](https://yarnpkg.com/lang/en/docs/install)

## Getting Started


```
$ git clone git@github.com:<your_fork>/sample-react-app.git
$ cd sample-react-app
$ yarn install
```

## Setup sample resources, service, and time windows

[How to obtain API KEY](https://gonebusy.github.io/api#/quick_start#step_1)
 
```
# To create new resources, service, and time windows
yarn setup -- API_KEY

# To teardown all resources, service, and time windows
yarn setup -- API_KEY teardown
```

## Run a local dev environment
Start a local server running on port 8080, at **http://localhost:8080**. Bundles js and css via webpack with hot reload.
It starts an express server on localhost:4000 to access gonebusy-nodejs-client and all requests made on localhost:8080 proxies to localhost:4000.

```
$ yarn dev-start
```

## Build Static files for deployment to CDN/hosting
Minifies js and css. 

```
$ yarn run build
```

## Run a local server serving Static files
Minifies js and css and starts server at **http://localhost:4000**

```
$ yarn start
```

## Add new dependencies

```
$ yarn add some-package-name
```
