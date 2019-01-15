import { RestObject } from '../restObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';
import { BaseConfig } from '../../auth/baseConfig';

export interface InsertRequest {
    allOrNone: boolean;
    records: any[];
}

export interface SaveResult extends BaseResult {
    warnings: any[];
}

export interface BaseResult {
    id: string;
    success: boolean;
    errors: Error[];
}

export interface Error {
    fields: any[];
    message: string;
    statusCode: string;
}

/* requires at least version v42 */
export class CompositeCollection {
    private endpoint: string;
    private client: Rest;

    /**
     * Creates a client that can send "Collection" requests to salesforce.
     * Collections request run in a single execution context
     * API version must be >= v42.0
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor (client?: Rest) {
        this.client = client || new Rest();
        this.endpoint = `/services/data/${this.client.version}/composite/sobjects`;
    }

    /**
     * Inserts up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Insert
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @param  {boolean} setId? if set to true, the passed SObject Id's will be updated when request if completed
     * @returns Promise<SaveResult[]> in order of pass SObjects
     */
    public insert = async (sobs: RestObject[], allOrNothing?: boolean, setId?: boolean): Promise<SaveResult[]> => {
        const dmlSobs = sobs.map((sob) => {
            const dmlSob = sob.prepareFor('insert');
            return dmlSob;
        });
        let payload: InsertRequest = {
            records: dmlSobs,
            allOrNone: allOrNothing !== false
        };
        let saveResults = (await this.client.request.post(this.endpoint,payload)).data;

        if (setId !== false) {
            for (let i = 0; i < saveResults.length; i++) {
                sobs[i].id = saveResults[i].id;
            }
        }
        this.resetModified(sobs, saveResults);
        return saveResults;
    }

    /**
     * Updates up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Update
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @returns Promise<SaveResult[]> in order of pass SObjects
     */
    public update = async (sobs: RestObject[], opts?: {allOrNothing?: boolean, sendAllFields?: boolean}): Promise<SaveResult[]> => {
        opts = opts || {};
        const dmlSobs = sobs.map((sob) => {
            const dmlSob = sob.prepareFor(opts.sendAllFields ? 'update_all' : 'update');
            dmlSob['Id'] = sob.id;
            return dmlSob;
        });
        let payload: InsertRequest = {
            records: dmlSobs,
            allOrNone: opts.allOrNothing !== false
        };
        let results: SaveResult[] = (await this.client.request.patch(this.endpoint, payload)).data;

        // clear out modified
        this.resetModified(sobs, results);

        return results;
    }

    /**
     * Deletes up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Delete
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @returns Promise<BaseResult[]> in order of pass SObjects
     */
    public delete = async (sobs: RestObject[], allOrNothing?: boolean): Promise<BaseResult[]> => {
        allOrNothing = allOrNothing !== false;
        return (await this.client.request.delete(`${this.endpoint}?ids=${sobs.map(s => s.id).join(',')}&allOrNone=${allOrNothing !== false}`)).data;
    }

    private resetModified = (sobs: RestObject[], results: SaveResult[]) => {
         // clear out modified
         for(let i = 0; i < results.length; i++){
            if(results[i].success){
                sobs[i]._modified.clear();
            }
        }
    }
}
