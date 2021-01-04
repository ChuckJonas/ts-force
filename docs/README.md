# Overview



`ts-force` is an "opinionated" client for the Salesforce REST API, which uses code generation to bring type safety to `SObjects`. It runs in both the browser and nodejs.

The **MISSION** of this project is to:

1. Create the BEST possible developer experience for working with the salesforce REST API by:
   * Providing types for `SObjects` that are resilient to schema changes
   * Mapping SF API names to standard js conventions
   * Make constructing SOQL queries as easy and fool-proof as possible. [See Demo](https://stackblitz.com/edit/ts-force-query-playground)
   * Provide "Quality of Life" features by abstracting away some of the more tedious parts of working with the REST API \(EG: `queryMore`, translating `multi-select picklist` to arrays, standardize error handling, etc\)
2. Maintain acceptable performance & reliability

**This repository contains two packages:**

* [![alt text](https://img.shields.io/npm/v/ts-force.svg?label=ts-force)](https://www.npmjs.com/package/ts-force): The runtime library for working with the REST API
* [![alt text](https://img.shields.io/npm/v/ts-force-gen.svg?label=ts-force-gen)](https://www.npmjs.com/package/ts-force-gen): A development CLI tool for generating SObject classes

