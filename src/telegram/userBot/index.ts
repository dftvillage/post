import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import readline from 'readline';
import { Api } from 'telegram';

import { environment } from '../../config/env';
import { UserBot } from '../../types';
import { CHANNEL } from '../../enums';
import { sleep, randomInt } from '../../utils';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export const userBots: UserBot[] = [
  {
    id: environment.USERBOT_ID,
    api_id: environment.USERBOT_API_ID,
    api_hash: environment.USERBOT_API_HASH,
    session_string: new StringSession(environment.USERBOT_API_SESSION),
    value: undefined as unknown as TelegramClient,
  },
  {
    id: environment.USERBOT_2_ID,
    api_id: environment.USERBOT_2_API_ID,
    api_hash: environment.USERBOT_2_API_HASH,
    session_string: new StringSession(environment.USERBOT_2_API_SESSION),
    value: undefined as unknown as TelegramClient,
  },
  {
    id: environment.USERBOT_3_ID,
    api_id: environment.USERBOT_3_API_ID,
    api_hash: environment.USERBOT_3_API_HASH,
    session_string: new StringSession(environment.USERBOT_3_API_SESSION),
    value: undefined as unknown as TelegramClient,
  },
  {
    id: environment.USERBOT_4_ID,
    api_id: environment.USERBOT_4_API_ID,
    api_hash: environment.USERBOT_4_API_HASH,
    session_string: new StringSession(environment.USERBOT_4_API_SESSION),
    value: undefined as unknown as TelegramClient,
  },
  {
    id: environment.USERBOT_5_ID,
    api_id: environment.USERBOT_5_API_ID,
    api_hash: environment.USERBOT_5_API_HASH,
    session_string: new StringSession(environment.USERBOT_5_API_SESSION),
    value: undefined as unknown as TelegramClient,
  },
];

export let mainUserBot: TelegramClient = userBots[0].value as TelegramClient;

export const initUserBot = async () => {
  for (const userBot of userBots) {
    userBot.value = new TelegramClient(userBot.session_string, userBot.api_id, userBot.api_hash, {
      connectionRetries: 5,
      timeout: 60000,
      autoReconnect: true,
    });

    userBot.value.setParseMode('html');

    await userBot.value.start({
      phoneNumber: async () => new Promise((resolve) => rl.question('Please enter your number: ', resolve)),
      password: async () => new Promise((resolve) => rl.question('Please enter your password: ', resolve)),
      phoneCode: async () => new Promise((resolve) => rl.question('Please enter the code you received: ', resolve)),
      onError: (err) => console.log(err),
    });

    console.log('You should now be connected.');

    console.log(userBot.value.session.save());

    // const channelUserNames = new Set(['dftvillage', , ...Object.values(CHANNEL.SLUG), ...Object.values(CHANNEL.SLUG_FOR_USERS)]);

    // for (const channelName of channelUserNames) {
    //   try {
    //     await userBot.value.invoke(new Api.channels.JoinChannel({ channel: channelName }));

    //     console.log(`Joined ${channelName}`);

    //     await sleep(randomInt(2, 4));
    //   } catch (e) {}
    // }
  }

  mainUserBot = userBots[0].value;
};
