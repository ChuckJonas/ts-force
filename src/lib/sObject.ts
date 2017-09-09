import {Rest} from './rest';
import {AxiosError} from 'axios';
/* Base SObject */

export class SObjectAttributes {
    public type?: string;
}

export abstract class SObject{
    constructor(type?: string) {

        this.attributes = new SObjectAttributes();
        this.attributes.type = type;
    }
    public Id?: string;
    public attributes: SObjectAttributes;
}


export interface DMLResponse {
    id: string;
    errors: any[];
    success: boolean;
}

export class RestObject extends SObject{

    constructor(type?: string) {
        super(type);
    }

    public insert(): Promise<DMLResponse> {
        return new Promise<DMLResponse>((resolve, reject) => {
            Rest.Instance.request.post(
                `/sobjects/${this.attributes.type}/`,
                this
            ).then((response) => {
                this.Id = response.data.id;
                resolve(response.data);
            }).catch((error: AxiosError) => {
                reject(error);
            });
        });
    }

    public update(): Promise<DMLResponse> {
        if (this.Id == null) {
            throw 'Must have Id to update!';
        }
        let data = Object.assign({}, this);
        data.Id = undefined;

        return new Promise<DMLResponse>((resolve, reject) => {
            Rest.Instance.request.post(
                `/sobjects/${this.attributes.type}/${this.Id}?_HttpMethod=PATCH`,
                data
            ).then((response) => {
                resolve(response.data);
            }).catch((error: AxiosError) => {
                reject(error);
            });
        });
    }

}

