import { RestObject } from '../sObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';
import { Job, JobRequest, JobStatus } from './job';
import { Batch, BatchStatus, BatchResult } from './batch';
import { chunkArray } from '../util';

// abstracted result
export interface BulkResult<T>{
    data: T[];
    status: BatchStatus;
    results: BatchResult[];
    handled: boolean;
}

export class BulkClient {

    public batchSize: number;

    private readonly JOB_ENDPOINT: string;
    private client: Rest;

    constructor () {
        this.batchSize = 10000;
        this.client = Rest.Instance;
        this.JOB_ENDPOINT = `/services/async/${this.client.version}/job`;
    }

    // abstracted request
    public async executeBulk<T extends RestObject> (objectApiName: string, operation: Job.OPERATION, records: T[],
                                        onResultsCallback?: (result: BulkResult<T>) => void): Promise<BulkResult<T>[]> {

        let jobStatus = await this.createJob({
            object: objectApiName,
            operation: operation,
            contentType: Job.CONTENT_TYPE.CSV
        });

        let batches: Map<string, BulkResult<T>> = new Map();
        let batchData = chunkArray<T>(records, this.batchSize);
        for (let batch of batchData) {
            let batchStatus = await this.addBatch(jobStatus.id, batch);
            batches.set(batchStatus.id,
                {data: batch, status: batchStatus, results: null, handled: false}
            );
        }

        const getOpenBatches = (batches: Map<string, BulkResult<T>>) => {
            return Array.from(batches.values()).filter(batch => {
                return batch.status.state === Batch.STATE.IN_PROGRESS || batch.status.state === Batch.STATE.QUEUED;
            });
        };

        while (getOpenBatches(batches).length > 0) {
            let allBatchesStatus = await this.getAllBatchStatus(jobStatus.id);

            for (let status of allBatchesStatus) {
                let batch = batches.get(status.id);
                if (batch.handled) {
                    continue;
                }
                batch.status = status;
                switch (batch.status.state){
                    case Batch.STATE.COMPLETED:
                    case Batch.STATE.FAILED:
                    case Batch.STATE.NOT_PROCESSED:
                        onResultsCallback(batch);
                    break;
                    default:
                        continue;
                }
                batch.handled = true;
            }
        }
        return Array.from(batches.values());
    }

    /* Job Management */
    public async createJob (job: JobRequest): Promise<JobStatus> {
        let resp = await this.client.request.post(
            `${this.JOB_ENDPOINT}`,
            job // always use JSON for these request
        );
        return resp.data;
    }

    public async getJobStatus (jobId: string): Promise<JobStatus> {
        let resp = await this.client.request.get(`${this.JOB_ENDPOINT}/${jobId}`);
        return resp.data;
    }

    public async closeJob (jobId: string): Promise<JobStatus>  {
        let resp = await this.client.request.post(
            `${this.JOB_ENDPOINT}/${jobId}`,
            {state : Job.STATE.CLOSED}
        );
        return resp.data;
    }

    public async abortJob (jobId: string): Promise<JobStatus> {
        let resp = await this.client.request.post(
            `${this.JOB_ENDPOINT}/${jobId}`,
            {state : Job.STATE.ABORTED}
        );
        return resp.data;
    }

    /* Batch Management */
    public async addBatch (jobId: string, records: RestObject[]): Promise<BatchStatus> {
        let data = records.map(rec => {
            rec.prepareForDML();
        });
        let resp = await this.client.request.post(
            `${this.JOB_ENDPOINT}/${jobId}/batches`,
            data
        );
        return resp.data;
    }

    public async getBatchStatus (jobId: string, batchId: string): Promise<BatchStatus> {
        let resp = await this.client.request.get(`${this.JOB_ENDPOINT}/${jobId}/batch/${batchId}/request`);
        return resp.data;
    }

    public async getAllBatchStatus (jobId: string): Promise<BatchStatus[]> {
        let resp = await this.client.request.get(`${this.JOB_ENDPOINT}/${jobId}/batch`);
        return resp.data;
    }

    public async getBatchResults (jobId: string, batchId: string): Promise<BatchResult[]> {
        let resp = await this.client.request.get(`${this.JOB_ENDPOINT}/${jobId}/batch/${batchId}/result`);
        return resp.data;
    }

}

export * from './batch';
export * from './job';
