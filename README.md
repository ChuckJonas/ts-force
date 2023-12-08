<img width="350" alt="ts-force" src="https://raw.githubusercontent.com/ChuckJonas/ts-force/master/logo.svg?sanitize=true">

[![build status](https://img.shields.io/github/actions/workflow/status/ChuckJonas/ts-force/ci.yaml?label=CI&logo=github)](https://github.com/ChuckJonas/ts-force/actions/workflows/ci.yaml)
[![npm version](https://img.shields.io/npm/v/ts-force.svg)](https://www.npmjs.org/package/ts-force)
[![license](https://img.shields.io/badge/license-BSD--3--CLAUSE-blue.svg)](https://github.com/ChuckJonas/ts-force/blob/master/LICENSE)

`ts-force` is a light-weight Salesforce ORM (more like an "opinionated" REST API client), which uses code generation to bring type safety to `SObjects`.  It can be run both in browser or in `node.js`.

The **MISSION** of this project is to:

1. Create the BEST possible developer experience for working with the salesforce REST API by:

  * Providing types for `SObjects` that are resilient to schema changes
  * Mapping SF API names to js friendly syntax
  * Make constructing SOQL queries as easy and fool-proof as possible. [See Demo](https://stackblitz.com/edit/ts-force-query-playground)
  * Provide "Quality of Life" features by abstracting away some of the more tedious parts of working with the REST API (EG: `queryMore`, translating `multi-select picklist` to arrays, standardize error handling, etc)

2. Maintain acceptable performance & reliability

## Usage

[See Documentation](https://ts-force.gitbook.io/ts-force/)
