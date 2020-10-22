import { isArray } from 'util';
import { CompositeBatch, CompositeBatchResult, isCompositeBatchSuccessResult, isCompositeBatchFailResult, CompositeBatchFailResult, Composite } from '.';
import { SObjectStatic, FieldResolver, SOQLQueryParams, QueryResponse, buildQuery, SObject, StandardizedSFError, StandardRestError, Rest } from '../..';

/**
 * Uses Composite chaining to retrieve up to 10k records in a single request.
 *    Much more efficient for large queries.  Minor performance hit for single queries returning
 *
 * @param qry: The query, or the next URL to retrieve
 * @param restInstance: Optional rest instance to run query against
 */
export const queryAllComposite = async (query: string, opts: { restInstance?: Rest, allRows?: boolean, nextUrl?: string }): Promise<SObject[]> => {
  opts = opts || {};
  const { restInstance, allRows, nextUrl } = opts;
  let client = restInstance || new Rest();
  let comp = new Composite(client);

  let reqUri;
  if (nextUrl) {
    // bit of a hack... should work but refactor ASAP
    reqUri = nextUrl;
  } else {
    reqUri = `/services/data/v${restInstance.config.version.toFixed(1)}/${opts.allRows ? 'queryAll' : 'query'}?q=${encodeURI(query)}`;
  }

  comp.addRequest({
    referenceId: 'req1',
    url: reqUri,
    method: 'GET'
  });

  comp.addRequest({
    referenceId: 'req2',
    url: '@{req1.nextRecordsUrl}',
    method: 'GET'
  });

  comp.addRequest({
    referenceId: 'req3',
    url: '@{req2.nextRecordsUrl}',
    method: 'GET'
  });

  comp.addRequest({
    referenceId: 'req4',
    url: '@{req3.nextRecordsUrl}',
    method: 'GET'
  });

  comp.addRequest({
    referenceId: 'req5',
    url: '@{req4.nextRecordsUrl}',
    method: 'GET'
  });

  let response = await comp.send();
  let newNextUrl = null;
  let records: SObject[] = [];

  for (let i = 0; i < response.compositeResponse.length; i++) { // subResponse of response.compositeResponse) {
    const subResponse = response.compositeResponse[i];
    const subReq = comp.compositeRequest[i];
    if (subResponse.httpStatusCode === 400 && isArray(subResponse.body) && subResponse.body.length && subResponse.body[0].message.indexOf('Invalid reference specified') >= 0) {
      break;
    } else if (subResponse.httpStatusCode >= 300) {
      // some other error happened
      throw { request: subReq, response: subResponse };
    }
    records = [...records, ...subResponse.body.records];
    newNextUrl = subResponse.body.nextRecordsUrl;
  }

  if (newNextUrl) { // go again... this could probably be more efficent by looking at the total number of req
    records = [...records, ...await queryAllComposite(null, { ...opts, nextUrl: newNextUrl })];
  }

  return records;
};

/**
*  Combines multiple RestObject "retrieve" calls using Composite Batch.
* @param {...{ [K in keyof T]: SObjectStatic<T[K]> }} sObjects: Accepts a tuple of SObject types you wish to query against
* @returns A function which can be used to build a query.
*    For each Object you passed in above, pass in a SOQL query, in the form of a string or a function (fields: FieldResolver) => SOQLQueryParams.
*    This function returns a tuple of CompositeBatchResult<QueryResponse<T>> in the order in which RestObjects were passed into the parent function.
* @example
* ```typescript
* let allResults = await compositeRetrieve(Account, Contact, User)(
*   f => ({select: f.select('id','accountNumber'), limit: 4000}),  // f: FieldResolver<Account>
*   f => ({select: f.select('id','firstName', 'email')}),           // f: FieldResolver<Contact>
*   'SELECT Id FROM User'  // raw SOQL strings are allowed as well
* );
*
* if(results[0].statusCode){
*   console.log(allResults[0].result.records);  //Accounts
* }
*
* allResults[1]; //CompositeBatchResult<QueryResponse<Contacts>>
* allResults[2]; //CompositeBatchResult<QueryResponse<Users>>
* // allResults[3] will yield type error
* ```
*/
export const compositeRetrieve = <T extends Array<any>>(...sObjects: { [K in keyof T]: SObjectStatic<T[K]> }) => {
  return async (
    ...queryFunctions: { [K in keyof T]: ((fields: FieldResolver<T[K]>) => SOQLQueryParams) | string }) => {
    let c = new CompositeBatch();
    let queryResults = [];
    let nextRecordQueries: Array<{ nextRecordsUrl: string, handleResults: (r: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void }> = [];
    sObjects.map((sObject, i) => {
      let qryFunc = queryFunctions[i];
      let qry;
      if (typeof qryFunc === 'string') {
        qry = queryFunctions;
      } else {
        qry = buildQuery(sObject, qryFunc);
      }

      const handleResults = (results: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => {
        if (isCompositeBatchFailResult(results)) {
          queryResults[i] = results;
        } else {
          let data = results.result.records.map(sob => {
            return sObject.fromSFObject(sob);
          });
          if (queryResults[i]) {
            queryResults[i] = [...data, ...queryResults[i]];
          } else {
            queryResults[i] = data;
          }

          if (!results.result.done) {
            nextRecordQueries.push({
              nextRecordsUrl: results.result.nextRecordsUrl,
              handleResults
            });
          }
        }

      };

      c.addQuery(
        qry,
        handleResults
      );
    });

    await c.send();
    while (nextRecordQueries.length) {
      let cN = new CompositeBatch();
      let nextReq;
      while (nextReq = nextRecordQueries.pop()) {
        cN.addQueryMore(nextReq.nextRecordsUrl, nextReq.handleResults);
      }

      await cN.send();
    }

    return queryResults as { [K in keyof T]: (Array<T[K]> | CompositeBatchFailResult<StandardRestError[]>) };
  };
};
