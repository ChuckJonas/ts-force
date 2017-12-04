
export interface JobRequest{
    object: string;
    operation: Job.OPERATION;
    contentType: Job.CONTENT_TYPE;
}

export namespace Job
{

    // only supporting JSON atm
    export enum CONTENT_TYPE {
        JSON = 'JSON',
        CSV = 'CSV'
    }

    export enum OPERATION {
        INSERT = 'insert',
        UPDATE = 'update',
        DELETE = 'delete',
        UPSERT = 'upsert'
    }

    export enum STATE {
        ABORTED = 'Aborted',
        OPEN = 'Open',
        CLOSED = 'Closed'
    }
}

export interface JobStatus {
    apexProcessingTime: number;
    apiActiveProcessingTime: number;
    apiVersion: number;
    concurrencyMode: string;
    contentType: Job.CONTENT_TYPE;
    createdById: string;
    createdDate: Date;
    id: string;
    numberBatchesCompleted: number;
    numberBatchesFailed: number;
    numberBatchesInProgress: number;
    numberBatchesQueued: number;
    numberBatchesTotal: number;
    numberRecordsFailed: number;
    numberRecordsProcessed: number;
    numberRetries: number;
    object: string;
    operation: Job.OPERATION;
    state: string;
    systemModstamp: Date;
    totalProcessingTime: number;
}
