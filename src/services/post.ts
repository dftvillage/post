import {
  type PostGetPayloadParams,
  type PostDeletePayloadParams,
  type PostCreatePayloadBody,
  type PostUpdatePayloadParams,
  type PostUpdatePayloadBody,
  type PostInfo,
} from '../types';
import { useFetch } from '../utils';

export const getPost = async (params: PostGetPayloadParams) => {
  return await useFetch<PostInfo>(`/api/post/${params.where.channel_id}`, { method: 'post', body: JSON.stringify(params.defaults) });
};

export const deletePost = async (params: PostDeletePayloadParams) => {
  return await useFetch(`/api/post/${params.channel_id}/${params.last_post_id}`, { method: 'delete' });
};

export const createPost = async (body: PostCreatePayloadBody) => {
  return await useFetch<PostInfo>(`/api/post`, { method: 'post', body: JSON.stringify(body) });
};

export const updatePost = async (params: PostUpdatePayloadParams, body: PostUpdatePayloadBody) => {
  return await useFetch<PostInfo>(`/api/post/${params.channel_id}`, { method: 'put', body: JSON.stringify(body) });
};
