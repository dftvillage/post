import { ParsedUserInfo } from '../../types';
import { FloodWaitError } from 'telegram/errors';

import { Api } from 'telegram';
import bigInt from 'big-integer';

import { userBot2 as userBot } from './index';
import { environment } from '../../config/env';
import { getAllParsedUsers, updateParsedUser } from '../../services/parsedUser';

const inviteDelayTime = () => (Math.random() * 50 + 150) * 1000; // 150 - 200
const massOffset = 20;

export const initInviteUsers = async () => {
  let inviteCount = 0;
  let inviteCountRange = 0;

  const inviteHandler = async (users: ParsedUserInfo[], index: number = 0): Promise<void> => {
    const currentUser = users[index];

    try {
      const inputUser = new Api.InputUser({ userId: bigInt(currentUser.telegram_id), accessHash: bigInt(currentUser.accessHash) });

      await userBot.invoke(new Api.channels.InviteToChannel({ channel: environment.PUBLIC_ID, users: [inputUser] }));

      await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'invited' });

      inviteCount++;
      inviteCountRange++;

      console.log(`\n[${inviteCount}/${index + 1}/${users.length}] ${currentUser.username ?? currentUser.telegram_id} invited`);

      if (users[index + 1]) {
        if (inviteCountRange >= 10) {
          const currentШnviteDelayTime = inviteDelayTime();

          inviteCountRange = 0;

          console.log(`\nDelay in ${currentШnviteDelayTime / 1000} seconds`);

          await new Promise((res) =>
            setTimeout(() => {
              console.log('Resume inviting\n');

              return res(true);
            }, currentШnviteDelayTime)
          );
        }

        return await inviteHandler(users, index + 1);
      }

      return console.log('Invites Complete');
    } catch (e: any) {
      const errorMessage = e?.message ?? String(e);

      console.log(`Failed:`, errorMessage);

      // Telegram попросил подождать
      if (e instanceof FloodWaitError) {
        const seconds = e.seconds ?? 60;

        console.log(`FloodWait ${seconds}s. Sleeping and retrying same user...`);

        await new Promise((res) => setTimeout(res, seconds * 1000));

        return await inviteHandler(users, index);
      }

      // Пользователь запретил приглашения
      if (errorMessage.includes('USER_PRIVACY_RESTRICTED', 'USER_NOT_MUTUAL_CONTACT')) {
        await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'privacy_restricted' });
      } else {
        // Остальные ошибки
        await updateParsedUser({ telegram_id: currentUser.telegram_id }, { invite_status: 'failed' });
      }

      if (users[index + 1]) {
        return await inviteHandler(users, index + 1);
      }
    }
  };

  try {
    const pendingUsers = await getAllParsedUsers({ where: { invite_status: 'pending' } });

    if (!pendingUsers.length) {
      return console.log('No pending users');
    }

    console.log(`Starting invite process. Users: ${pendingUsers.length}`);

    await inviteHandler(pendingUsers);
  } catch (e) {
    console.error('Invite process failed:', e);
  }
};

export const massInitInviteUsers = async () => {
  const massInviteHandler = async (users: ParsedUserInfo[]): Promise<void> => {
    const offsetUsers = users.slice(0, massOffset);

    const inputUsers = offsetUsers.map((user) => new Api.InputUser({ userId: bigInt(user.telegram_id), accessHash: bigInt(user.accessHash) }));

    try {
      await userBot.invoke(new Api.channels.InviteToChannel({ channel: environment.PUBLIC_ID, users: inputUsers }));

      for (const user of inputUsers) {
        await updateParsedUser({ telegram_id: user.userId.toString() }, { invite_status: 'invited' });
      }

      const nextUsers = offsetUsers.slice(massOffset);

      if (nextUsers.length) {
        const currentШnviteDelayTime = inviteDelayTime();

        console.log(`\nDelay in ${currentШnviteDelayTime / 1000} seconds`);

        await new Promise((res) =>
          setTimeout(() => {
            console.log('Resume inviting\n');

            return res(true);
          }, currentШnviteDelayTime)
        );

        return await massInviteHandler(nextUsers);
      }

      return console.log('Invites Complete');
    } catch (e: any) {
      const errorMessage = e?.message ?? String(e);

      console.log(`Failed:`, errorMessage);

      // Telegram попросил подождать
      if (e instanceof FloodWaitError) {
        const seconds = e.seconds ?? 60;

        console.log(`FloodWait ${seconds}s. Sleeping and retrying same user...`);

        await new Promise((res) => setTimeout(res, seconds * 1000));

        return await massInviteHandler(users);
      }

      const nextUsers = users.slice(0, massOffset);

      if (nextUsers.length) {
        return await massInviteHandler(nextUsers);
      }
    }
  };

  try {
    const pendingUsers = await getAllParsedUsers({ where: { invite_status: 'pending' } });

    if (!pendingUsers.length) {
      return console.log('No pending users');
    }

    console.log(`Starting invite process. Users: ${pendingUsers.length}`);

    await massInviteHandler(pendingUsers);
  } catch (e) {
    console.error('Invite process failed:', e);
  }
};
