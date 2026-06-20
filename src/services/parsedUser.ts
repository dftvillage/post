import {
  type ParsedUserGetPayloadParams,
  type ParsedUserDeletePayloadParams,
  type ParsedUserCreatePayloadBody,
  type ParsedUserUpdatePayloadParams,
  type ParsedUserUpdatePayloadBody,
  type ParsedUserInfo,
  type ParsedUserGetAllPayloadParams,
} from '../types';
import { useFetch } from '../utils';

export const getAllParsedUsers = async (params?: ParsedUserGetAllPayloadParams) => {
  const body = params ? JSON.stringify(params) : undefined;

  return await useFetch<ParsedUserInfo[]>(`/api/parsed-user/all`, { method: 'post', body });
};

export const getParsedUser = async (params: ParsedUserGetPayloadParams) => {
  return await useFetch<ParsedUserInfo[]>(`/api/parsed-user/${params.where.telegram_id}`, { method: 'post', body: JSON.stringify(params.defaults) });
};

export const deleteParsedUser = async (params: ParsedUserDeletePayloadParams) => {
  return await useFetch(`/api/parsed-user/${params.telegram_id}`, { method: 'delete' });
};

export const createParsedUser = async (body: ParsedUserCreatePayloadBody) => {
  return await useFetch<ParsedUserInfo>(`/api/parsed-user`, { method: 'post', body: JSON.stringify(body) });
};

export const updateParsedUser = async (params: ParsedUserUpdatePayloadParams, body: ParsedUserUpdatePayloadBody) => {
  return await useFetch<ParsedUserInfo>(`/api/parsed-user/${params.telegram_id}`, { method: 'put', body: JSON.stringify(body) });
};
