// // tslint:disable:no-unused-expression
import 'mocha';
import { expect } from 'chai';

import { parseLimitsFromResponse } from '../../../src/rest/utils';
import { AxiosResponse } from 'axios';

describe('parseLimitsFromResponse', () => {
    it('happy path', () => {
        const fakeResponse = {
            headers: {
                'sforce-limit-info': 'api-usage=100/200' 
            }
        } as unknown as AxiosResponse;
        const result = parseLimitsFromResponse(fakeResponse);
        expect(result.limit).to.equal(200);
        expect(result.used).to.equal(100);
    });
    it('no header', () => {
        const fakeResponse = {
            headers: {
               
            }
        } as AxiosResponse;
        const result = parseLimitsFromResponse(fakeResponse);
        expect(result).to.be.eql(null);
    });
    it('header invalid format', () => {
        const fakeResponse = {
            headers: {
                'sforce-limit-info': 'so-invalid' 
            }
        } as unknown as AxiosResponse;
        const result = parseLimitsFromResponse(fakeResponse);
        expect(result).to.eql(null);
    });
});
