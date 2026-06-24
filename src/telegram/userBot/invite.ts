import { ParsedUserInfo, UserBot } from '../../types';
import { FloodWaitError } from 'telegram/errors';

import { Api } from 'telegram';
import bigInt from 'big-integer';

import { userBots } from './index';
import { environment } from '../../config/env';
import { getAllParsedUsers, updateParsedUser } from '../../services/parsedUser';
import { sleep, randomInt } from '../../utils';

export const massInitInviteUsers = async () => {
  for (const index in userBots) {
    try {
      botWorker(+index);
    } catch (e) {
      console.error(`Invite process of ${index} bot failed:`, e);
    }
  }
};

const inviteHandler = async (userBotIndex: number, users: ParsedUserInfo[]): Promise<{ seconds: number } | void> => {
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const currentUser = users[userIndex];

    try {
      const inputUser = new Api.InputUser({ userId: bigInt(currentUser.telegram_id), accessHash: bigInt(currentUser.accessHash) });

      await userBots[userBotIndex].value.invoke(new Api.channels.InviteToChannel({ channel: environment.PUBLIC_ID, users: [inputUser] }));

      await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'invited' });

      await sleep(randomInt(5, 60) * 60 * 1000);
    } catch (e: any) {
      const errorMessage = e?.message ?? String(e);

      console.log('Failed:', errorMessage);

      if (errorMessage.includes('PEER_FLOOD')) {
        return;
      }

      if (e instanceof FloodWaitError) {
        const seconds = e.seconds ?? randomInt(60, 70);

        return { seconds };
      }

      if (errorMessage.includes('USER_PRIVACY_RESTRICTED') || errorMessage.includes('USER_NOT_MUTUAL_CONTACT')) {
        await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'privacy_restricted' });
      } else {
        await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'failed' });
      }
    }
  }
};

const botWorker = async (botIndex: number) => {
  const userBot = userBots[botIndex];
  const botId = userBot.id.toString();

  const pendingUsers = await getAllParsedUsers({ where: { invite_status: 'pending', bot_id: botId }, limit: randomInt(10, 20) });

  if (!pendingUsers.length) {
    return console.log(`\n Bot ${botId} hast pending users`);
  }

  console.log(`Bot ${botId} ---- ${botIndex}: inviting ${pendingUsers.length} users`);

  await inviteHandler(botIndex, pendingUsers);

  return console.log(`\n Bot ${botId} complete`);

  // while (true) {
  //   const pendingUsers = await getAllParsedUsers({ where: { invite_status: 'pending', bot_id: botId }, limit: randomInt(10, 20) });

  //   if (!pendingUsers.length) {
  //     return console.log(`\n Bot ${botId} complete`);
  //   }

  //   console.log(`Bot ${botId} ---- ${botIndex}: inviting ${pendingUsers.length} users`);

  //   const result = await inviteHandler(botIndex, pendingUsers);

  //   let delay = randomInt(150, 200) * 1000;

  //   if (typeof result === 'object' && 'seconds' in result) {
  //     console.log(`Flood Delay in ${result.seconds} seconds`);

  //     delay = result.seconds * 1000;
  //   }

  //   console.log(`Bot ${botId}: sleeping ${Math.round(delay / 1000)}s`);

  //   await sleep(delay);
  // }
};

// const massInviteHandler = async (userBotIndex: number, users: ParsedUserInfo[]): Promise<{ seconds: number } | void> => {
//   const inputUsers = users.map((user) => new Api.InputUser({ userId: bigInt(user.telegram_id), accessHash: bigInt(user.accessHash) }));

//   try {
//     await userBots[userBotIndex].value.invoke(new Api.channels.InviteToChannel({ channel: environment.PUBLIC_ID, users: inputUsers }));

//     for (const user of inputUsers) {
//       console.log(`User ${user.userId} invited from ${userBots[userBotIndex].id} bot`);

//       await updateParsedUser({ telegram_id: user.userId.toString() }, { invite_status: 'invited' });
//     }

//     return console.log(`Invite ${users.length} user from ${userBots[userBotIndex].id} bot Complete`);
//   } catch (e: any) {
//     const errorMessage = e?.message ?? String(e);

//     console.log(`Failed:`, errorMessage);

//     // Telegram попросил подождать
//     if (e instanceof FloodWaitError) {
//       const seconds = e.seconds ?? 60;

//       console.log(`FloodWait from ${userBots[userBotIndex].id} bot ${seconds}s. Sleeping and retrying same user...`);

//       return { seconds };
//     }
//   }
// };
