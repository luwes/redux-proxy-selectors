# Redux Proxy Selectors

[![Build Status](https://travis-ci.org/luwes/redux-proxy-selectors.svg?branch=master)](https://travis-ci.org/luwes/redux-proxy-selectors)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Redux enhancer to access selectors directly from state as getters.

## Install

```
npm i --save redux-proxy-selectors
```

## API

`createProxySelectors(selectors)`

**selectors**  
A single map containing all the selectors with a similar shape as your reducer.


## Usage

```js
const store = createStore(reducer, createProxySelectors(selectors))
```
