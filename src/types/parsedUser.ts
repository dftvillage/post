export interface ParsedUserInfo {
  id: number;
  telegram_id: string;
  bot_id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  invite_status?: 'pending' | 'invited' | 'privacy_restricted' | 'flood_wait' | 'failed';
  langCode?: string;
  deleted: boolean;
  bot: boolean;
  verified: boolean;
  premium: boolean;
  support: boolean;
  accessHash: string;
}

export interface ParsedUserCreatePayloadBody extends Omit<ParsedUserInfo, 'id'> {}

export interface ParsedUserUpdatePayloadParams extends Pick<ParsedUserInfo, 'telegram_id'> {}

export interface ParsedUserUpdatePayloadBody extends Partial<Omit<ParsedUserInfo, 'id'>> {}

export interface ParsedUserGetPayloadParams {
  where: Pick<ParsedUserInfo, 'telegram_id'>;
  defaults?: ParsedUserCreatePayloadBody;
}

export interface ParsedUserGetAllPayloadParams {
  where: Partial<Pick<ParsedUserInfo, 'telegram_id' | 'invite_status' | 'bot_id'>>;
  limit?: number;
}

export interface ParsedUserDeletePayloadParams extends Pick<ParsedUserInfo, 'telegram_id'> {}
