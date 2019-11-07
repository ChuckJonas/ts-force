import { CompositeBatch, CompositeBatchResult, isCompositeBatchSuccessResult, isCompositeBatchFailResult, CompositeBatchFailResult } from '.';
import { SObjectStatic, FieldResolver, SOQLQueryParams, QueryResponse, buildQuery, SObject, StandardizedSFError, StandardRestError } from '../..';

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
    let nextRecordQueries: Array<{nextRecordsUrl: string, handleResults: (r: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void}> = [];
    sObjects.map((sObject, i) => {
      let qryFunc = queryFunctions[i];
      let qry;
      if (typeof qryFunc === 'string') {
        qry = queryFunctions;
      } else {
        qry = buildQuery(sObject, qryFunc);
      }

      const handleResults = (results: CompositeBatchResult<QueryResponse<any>, StandardRestError[]> ) => {
        if (isCompositeBatchFailResult(results)) {
          queryResults[i] = results;
        }else {
          let data = results.result.records.map(sob => {
            return sObject.fromSFObject(sob);
          });
          if (queryResults[i]) {
            queryResults[i] = [...data, ...queryResults[i]];
          }else {
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
