import { RestObject } from '../sObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';

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

// requires at least version v42
export class CompositeCollection {
    private endpoint: string;
    private client: Rest;
    constructor () {
        this.client = Rest.Instance;
        this.endpoint = `/services/data/${Rest.Instance.version}/composite/sobjects`;
    }

    public insert = async (sobs: RestObject[], allOrNothing?: boolean, setId?: boolean): Promise<SaveResult[]> => {
        const dmlSobs = sobs.map((sob) => {
            console.log(sob);
            const dmlSob = sob.prepareForDML();
            console.log(dmlSob);
            // dmlSob["Id"] = sob.id;
            // dmlSob["attributes"] = sob.attributes;
            return dmlSob;
        });
        let payload: InsertRequest = {
            records: dmlSobs,
            allOrNone: allOrNothing !== false
        };
        let saveResults =  await this.client.handleRequest<SaveResult[]>(
            () => {
                return Rest.Instance.request.post(
                    this.endpoint,
                    payload
                );
            }
        );
        if (setId !== false) {
            for (let i = 0; i < saveResults.length; i++) {
                sobs[i].id = saveResults[i].id;
            }
        }
        return saveResults;
    }

    public update = async (sobs: RestObject[], allOrNothing?: boolean): Promise<SaveResult[]> => {
        const dmlSobs = sobs.map((sob) => {
            const dmlSob = sob.prepareForDML();
            dmlSob['id'] = sob.id;
            return dmlSob;
        });
        let payload: InsertRequest = {
            records: dmlSobs,
            allOrNone: allOrNothing !== false
        };
        return await this.client.handleRequest<SaveResult[]>(
            () => {
                return this.client.request.patch(
                    this.endpoint,
                    payload
                );
            }
        );
    }

    public delete = async (sobs: RestObject[], allOrNothing?: boolean): Promise<BaseResult[]> => {
        allOrNothing = allOrNothing ? allOrNothing : true;
        return await this.client.handleRequest<BaseResult[]>(
            () => {
                return this.client.request.delete(`${this.endpoint}?ids=${sobs.map(s => s.id).join(',')}&allOrNone=${allOrNothing !== false}`);
            }
        );
    }
}
