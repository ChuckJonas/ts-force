import { AxiosResponse } from 'axios';
import { ApiLimit } from './restTypes';

const LIMITS_REGEX = /api-usage=(\d+)\/(\d+)/;

export const parseLimitsFromResponse = (response: AxiosResponse): ApiLimit => {
  if (response.headers && response.headers['sforce-limit-info']) {
    const match = LIMITS_REGEX.exec(response.headers['sforce-limit-info']);
    if (!match) {
      return null;
    }
    const [, used, total] = match;
    return {
      used: Number(used),
      limit: Number(total)
    };
  }
  return null;
};
