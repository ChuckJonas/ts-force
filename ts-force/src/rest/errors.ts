import { AxiosError } from 'axios';
import { CompositeBatchResult, InvokableResult } from '..';

export interface AxiosErrorException {
    type: 'axios';
    e: AxiosError;
}

export class CompositeError extends Error {
    compositeResponses: CompositeBatchResult<any, any>[];
}

export interface CompositeErrorException {
    type: 'composite';
    e: CompositeError;
}

export interface InvokableErrorException {
    type: 'invokable';
    e: InvokableResult<{}>;
}

export interface AnyErrorException {
    type: 'any';
    e: Error;
}

//=== Aggregate Types ===
export interface StandardRestError {
    errorCode?: string;
    message: string;
}

export interface StandardizedSFError {
    errorDetails: StandardRestError[];
}

export type StandardAnyError = StandardizedSFError & AnyErrorException;
export type StandardAxiosError = StandardizedSFError & AxiosErrorException;
export type StandardCompositeError = StandardizedSFError & CompositeErrorException;
export type StandardInvokableError = StandardizedSFError & InvokableErrorException;
export type TsForceException = StandardAnyError | StandardAxiosError | StandardCompositeError | StandardInvokableError;

export const getStandardError = (e: Error): TsForceException => {
    let err = getExceptionError(e);
    switch (err.type) {
        case 'any':
            return {
                type: err.type,
                e: err.e,
                errorDetails: [{ message: e.message }]
            };
        case 'axios':
            if (isInvokableError(err.e.response.data)) {
                let invokableResults = err.e.response.data;
                return {
                    type: 'invokable',
                    e: err.e.response.data,
                    errorDetails: invokableResults.reduce((result, e) => [...result, ...e.errors], []).map((e => {
                        return { message: e.message, errorCode: e.statusCode };
                    }))
                };
            } else {
                return {
                    type: err.type,
                    e: err.e,
                    errorDetails: err.e.response.data
                };
            }

        case 'composite':
            return {
                type: err.type,
                e: err.e,
                errorDetails: err.e.compositeResponses.reduce((result, e) => [...result, ...e.result], [])
            };
    }
};

export const getExceptionError = (e: any): AnyErrorException | AxiosErrorException | CompositeErrorException | InvokableErrorException => {
    if (isAxiosError(e)) {
        return {
            type: 'axios',
            e
        };
    } else if (isCompositeError(e)) {
        return {
            type: 'composite',
            e
        };
    }
    else if (isInvokableError(e)) {
        return {
            type: 'invokable',
            e
        };
    }
    return {
        type: 'any',
        e
    };
};

export const isAxiosError = (error: any | AxiosError): error is AxiosError => {
    return error.request !== undefined && error.response !== undefined;
};

export const isCompositeError = (error: any | CompositeError): error is CompositeError => {
    return error.compositeResponses !== undefined;
};

export const isInvokableError = (error: any | InvokableResult<any>): error is InvokableResult<any> => {
    return Array.isArray(error) && error.length > 0 && error[0].actionName !== undefined;
};
