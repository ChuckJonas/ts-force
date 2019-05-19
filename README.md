<img width="350" alt="ts-force" src="https://raw.githubusercontent.com/ChuckJonas/ts-force/master/logo.svg?sanitize=true">

[![alt text](https://travis-ci.org/ChuckJonas/ts-force.svg?branch=master)](https://travis-ci.org/ChuckJonas/ts-force)
[![alt text](https://img.shields.io/badge/license-BSD--3--CLAUSE-blue.svg)](https://github.com/ChuckJonas/ts-force/blob/master/LICENSE)

`ts-force` is a light-weight Salesforce ORM (more like an "opinionated" REST API client), which uses code generation to bring type safety to `SObjects`.  It can be run both in browser or in `node.js`.

The **MISSION** of this project is to:

1. Create the BEST possible developer experience for working with the salesforce REST API by:

  * Providing types for `SObjects` that are resilient to schema changes
  * Mapping SF API names to js friendly syntax
  * Make constructing SOQL queries as easy and fool-proof as possible. [See Demo](https://stackblitz.com/edit/ts-force-query-playground)
  * Provide "Quality of Life" features by abstracting away some of the more tedious parts of working with the REST API (EG: `queryMore`, translating `multi-select picklist` to arrays, standardize error handling, etc)

2. Maintain acceptable performance & reliability

This repository contains two packages:

- [![alt text](https://img.shields.io/npm/v/ts-force.svg?label=ts-force)](https://www.npmjs.com/package/ts-force): The runtime library for working with the REST API
- [![alt text](https://img.shields.io/npm/v/ts-force-gen.svg?label=ts-force-gen)](https://www.npmjs.com/package/ts-force-gen): A development CLI tool for generating SObject classes

## Getting Started

The fastest way to get up and going with this library is to follow the ["Getting Started" tutorial](https://github.com/ChuckJonas/ts-force/wiki).

For additional information, see the individual packages readme:

- [ts-force](./ts-force)
- [ts-force-gen](./ts-force-gen)
