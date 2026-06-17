import { CHANNEL } from '../../enums';

import { Api } from 'telegram';

import { getParsedUser, getAllParsedUsers } from '../../services/parsedUser';
import { userBot } from './index';

let requestUsersDelay: ReturnType<typeof setTimeout> | undefined = undefined;
let requestRepliesDelay: ReturnType<typeof setTimeout> | undefined = undefined;
const requestRepliesDelayTime: number = 2 * 1000;
const allParsedUserIds = new Set<string>();

const channels = Object.values(CHANNEL.SLUG_FOR_USERS);

function isUser(entity: unknown): entity is Api.User {
  return entity instanceof Api.User;
}

const fetchChannelUsersPost = async (messageIds: number[], channelName: string | number, index: number = 0) => {
  const postId = messageIds[index];
  const channelHumanName = CHANNEL.NAME[channelName];

  console.log(`\nFetch replies for channel "${channelHumanName}" from post ${postId}`);

  const replies = await userBot.invoke(
    new Api.messages.GetReplies({
      peer: channelName,
      msgId: postId,
      offsetId: 0,
      offsetDate: 0,
      addOffset: 0,
      limit: 400,
      maxId: 0,
      minId: 0,
    })
  );

  if ('users' in replies) {
    const { users: parsedUsers } = replies.users.reduce(
      (total, current) => {
        if (
          !isUser(current) ||
          !current.accessHash ||
          current.bot ||
          current.support ||
          current.deleted ||
          allParsedUserIds.has(current.id.toString())
        ) {
          return total;
        }

        const userId = current.id.toString();

        if (!total.ids.has(userId)) {
          allParsedUserIds.add(userId);

          total.ids.add(userId);

          total.users.push(current);
        }

        return total;
      },
      { ids: new Set<string>(), users: [] as Api.User[] }
    );

    if (parsedUsers.length) {
      for (let user of parsedUsers) {
        const userId = user.id.toString();

        await getParsedUser({
          where: { telegram_id: userId },
          defaults: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bot: !!user.bot,
            deleted: !!user.deleted,
            phone: user.phone,
            premium: !!user.premium,
            support: !!user.support,
            telegram_id: userId,
            verified: !!user.verified,
            langCode: user.langCode,
            accessHash: user.accessHash?.toString()!,
          },
        });
      }
    }
  }

  if (messageIds[index + 1]) {
    clearInterval(requestRepliesDelay);

    console.log(`Delay in ${requestRepliesDelayTime / 1000} seconds for channel "${channelHumanName}", post ${postId}`);

    return await new Promise((res) => {
      requestRepliesDelay = setTimeout(async () => {
        console.log(`Resume post ${postId} for channel "${channelHumanName}"`);

        return res(await fetchChannelUsersPost(messageIds, channelName, index + 1));
      }, requestRepliesDelayTime);
    });
  }
};

const fetchUsersChannel = async (index: number = 0) => {
  const channelName = channels[index];
  const channelHumanName = CHANNEL.NAME[channels[index]];

  const messageIds = (await userBot.getMessages(channelName, { limit: 50 }))
    .filter((message) => message.id && message.replies?.replies && message.replies.comments)
    .map((message) => message.id)
    .reverse();

  if (!messageIds.length) {
    console.log(`No new posts in "${channelHumanName}" channel`);
  } else {
    console.log(`Parsing "${channelHumanName}" users started`);

    await fetchChannelUsersPost(messageIds, channelName);
  }

  if (channels[index + 1]) {
    return await fetchUsersChannel(index + 1);
  }

  console.log(`\nParsing users COMPLETE`);

  clearInterval(requestUsersDelay);

  requestUsersDelay = setTimeout(() => fetchUsersChannel(), 15 * 1000 * 60);
};

export const parseChannelCommentUsers = async () => {
  try {
    allParsedUserIds.clear();

    const ids = (await getAllParsedUsers()).map((user) => user.telegram_id);

    ids.forEach((id) => allParsedUserIds.add(id));
  } catch (e) {}

  await fetchUsersChannel();
};
