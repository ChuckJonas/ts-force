import { AxiosError } from 'axios';
import { CompositeBatchResult } from '..';

export interface AxiosErrorException{
    type: 'axios';
    e: AxiosError;
}

export interface CompositeErrorException{
    type: 'composite';
    e: CompositeError;
}

export interface AnyErrorException{
    type: 'any';
    e: Error;
}

export interface StandardizedSFError {
    errorDetails: StandardRestError[];
}

export type StandardAnyError = StandardizedSFError & AnyErrorException;
export type StandardAxiosError = StandardizedSFError & AxiosErrorException;
export type StandardCompositeError = StandardizedSFError & CompositeErrorException;

export type TsForceException = StandardAnyError | StandardAxiosError | StandardCompositeError;

export interface StandardRestError{
    errorCode?: string;
    message: string;
}

export class CompositeError extends Error {
    compositeResponses: CompositeBatchResult[];
}

export const getStandardError = (e: Error): TsForceException =>  {
    let err = getExceptionError(e);
    switch (err.type) {
        case 'any':
            return {
                type: err.type,
                e: err.e,
                errorDetails: [{message: e.message}]
            };
        case 'axios':
            return {
                type: err.type,
                e: err.e,
                errorDetails: err.e.response.data
            };
        case 'composite':
            return {
                type: err.type,
                e: err.e,
                errorDetails: err.e.compositeResponses.reduce((result, e) => [...result, ...e.result], [])
            };
    }
};

export const getExceptionError = (e: any): AnyErrorException | AxiosErrorException | CompositeErrorException => {
    if (isAxiosError(e)) {
        return {
            type: 'axios',
            e
        };
    }else if (isCompositeError(e)) {
        return {
            type: 'composite',
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
