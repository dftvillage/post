export interface PostInfo {
  id: number;
  last_post_id?: number;
  channel_id: bigInt.BigInteger;
}

export interface PostCreatePayloadBody extends Omit<PostInfo, 'id'> {}

export interface PostUpdatePayloadParams extends Pick<PostInfo, 'channel_id'> {}

export interface PostUpdatePayloadBody extends Pick<PostInfo, 'last_post_id'> {}

export interface PostGetPayloadParams {
  where: Omit<PostCreatePayloadBody, 'last_post_id'>;
  defaults?: PostCreatePayloadBody;
}

export interface PostDeletePayloadParams extends Pick<PostInfo, 'last_post_id' | 'channel_id'> {}
