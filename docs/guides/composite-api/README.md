# Composite API

The [Composite API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite.htm) allows you to compose multiple api request, into a single http request.  

`ts-force` currently supports the following composite resources:

* [Composite](composite.md) : Used to compose to 10 calls in a single request.  The output of one call can be used in subsequent requests.
* [Composite Batch](composite-batch.md) : Used to compose up to 25, non-related calls in a single request
* [Composite Collections](composite-collections.md) : Used to create/update/delete collections of up to 200 records

Support for the new Graph API is planned.

