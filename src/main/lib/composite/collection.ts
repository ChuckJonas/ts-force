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

    public insert = async (sobs: RestObject[], allOrNothing?: boolean): Promise<SaveResult[]> => {
        allOrNothing = allOrNothing ? allOrNothing : true;
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
            allOrNone: allOrNothing
        };
        return (await Rest.Instance.request.post(
            this.endpoint,
            payload
        )).data;
    }

    public update = async (sobs: RestObject[], allOrNothing?: boolean): Promise<SaveResult[]> => {
        allOrNothing = allOrNothing ? allOrNothing : true;
        const dmlSobs = sobs.map((sob) => {
            const dmlSob = sob.prepareForDML();
            dmlSob['id'] = sob.id;
            return dmlSob;
        });
        let payload: InsertRequest = {
            records: dmlSobs,
            allOrNone: allOrNothing
        };
        return (await Rest.Instance.request.patch(
            this.endpoint,
            payload
        )).data;
    }

    public delete = async (sobs: RestObject[], allOrNothing?: boolean): Promise<BaseResult[]> => {
        allOrNothing = allOrNothing ? allOrNothing : true;
        return (await Rest.Instance.request.delete(`${this.endpoint}?ids=${sobs.map(s => s.id).join(',')}&allOrNone=${allOrNothing}`)).data;
    }
}
