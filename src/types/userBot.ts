import { environment } from '../config/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export interface UserBot {
  id: typeof environment.USERBOT_ID;
  api_id: typeof environment.USERBOT_API_ID;
  api_hash: typeof environment.USERBOT_API_HASH;
  session_string: StringSession;
  value: TelegramClient;
}
