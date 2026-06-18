import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import readline from 'readline';

import { environment } from '../../config/env';

const stringSession = new StringSession(environment.USERBOT_API_SESSION);
const stringSession2 = new StringSession(environment.USERBOT_2_API_SESSION);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export const userBot = new TelegramClient(stringSession, environment.USERBOT_API_ID, environment.USERBOT_API_HASH, {
  connectionRetries: 5,
  timeout: 60000,
  autoReconnect: true,
});

export const userBot2 = new TelegramClient(stringSession2, environment.USERBOT_2_API_ID, environment.USERBOT_2_API_HASH, {
  connectionRetries: 5,
  timeout: 60000,
  autoReconnect: true,
});

export const initUserBot = async () => {
  userBot.setParseMode('html');

  await userBot.start({
    phoneNumber: async () => new Promise((resolve) => rl.question('Please enter your number: ', resolve)),
    password: async () => new Promise((resolve) => rl.question('Please enter your password: ', resolve)),
    phoneCode: async () => new Promise((resolve) => rl.question('Please enter the code you received: ', resolve)),
    onError: (err) => console.log(err),
  });

  console.log('You should now be connected.');

  userBot.session.save();

  // ============

  userBot2.setParseMode('html');

  await userBot2.start({
    phoneNumber: async () => new Promise((resolve) => rl.question('Please enter your number: ', resolve)),
    password: async () => new Promise((resolve) => rl.question('Please enter your password: ', resolve)),
    phoneCode: async () => new Promise((resolve) => rl.question('Please enter the code you received: ', resolve)),
    onError: (err) => console.log(err),
  });

  // console.log('You should now be connected.');

  // console.log(userBot2.session.save());
  userBot2.session.save();
};
