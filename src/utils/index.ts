import { environment } from '../config/env';

export const useFetch = async <T>(input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(`http://${environment.HOST}:${environment.PORT}${input}`, {
    ...(init || {}),
    headers: { ...(init?.headers || {}), 'Content-Type': 'application/json' },
  });

  const json = (await response.json()) as T;

  if ('error' in (json as Object)) {
    const currentError = json as { error: string };

    throw new Error(currentError.error);
  }

  return json;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
