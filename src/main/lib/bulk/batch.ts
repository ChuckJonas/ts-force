
export interface BatchStatus {
    apexProcessingTime: number;
    apiActiveProcessingTime: number;
    createdDate: Date;
    id: string;
    jobId: string;
    numberRecordsFailed: number;
    numberRecordsProcessed: number;
    state: Batch.STATE;
    systemModstamp: Date;
    totalProcessingTime: number;
}

export interface BatchResult {
    success: boolean;
    created: boolean;
    id: string;
    errors: any[];
}

export namespace Batch
{
    export enum STATE {

        // Processing of the batch has not started yet.
        // If the job associated with this batch is aborted, the batch isn’t processed and its state is set to Not Processed.
        QUEUED = 'Queued',

        // The batch is being processed. If the job associated with the batch is aborted, the batch is still processed to completion.
        // You must close the job associated with the batch so that the batch can finish processing.
        IN_PROGRESS = 'InProgress',

        // The batch has been processed completely, and the result resource is available.
        // The result resource indicates if some records have failed.
        // A batch can be completed even if some or all the records have failed.
        // If a subset of records failed, the successful records aren’t rolled back.
        COMPLETED = 'Completed',

        // The batch failed to process the full request due to an unexpected error,
        // such as the request is compressed with an unsupported format, or an internal server error.
        // Even if the batch failed, some records could have been completed successfully.
        // If the numberRecordsProcessed field in the response is greater than zero, you should get the results to
        // see which records were processed, and if they were successful.
        FAILED = 'Failed',

        // The batch won’t be processed. This state is assigned when a job is aborted while the batch is queued.
        // For bulk queries, if the job has PK chunking enabled, this state is assigned to the original batch
        // that contains the query when the subsequent batches are created.
        // After the original batch is changed to this state, you can monitor the subsequent batches
        // and retrieve each batch’s results when it’s completed.
        NOT_PROCESSED = 'Not Processed'
    }
}
