import { CHANNEL } from '../../enums';
import { PostInfo } from '../../types';

import { unlink } from 'node:fs/promises';

import { Api } from 'telegram';

import { getPost, updatePost } from '../../services/post';

import { environment } from '../../config/env';
import { userBot } from './index';

let requestDelay: ReturnType<typeof setTimeout> | undefined = undefined;

const channels = Object.values(CHANNEL.SLUG);

export const watchChannels = async () => {
  const fetchChannel = async (index: number = 0) => {
    const channelName = channels[index];
    const channelNameForMap = ('' + channels[index]) as keyof typeof CHANNEL.NAME;
    const channelHumanName = CHANNEL.NAME[channelNameForMap];

    const channel = await userBot.getEntity(channelName);
    const channel_id = channel.id;
    let lastChannelPostId: number | undefined = undefined;

    try {
      lastChannelPostId = (await getPost({ where: { channel_id }, defaults: { channel_id } }))?.last_post_id || 0;
    } catch (e) {
      return 'ERROR';
    }

    const messages = await userBot.getMessages(channel, { limit: 50, minId: lastChannelPostId });

    const formattedMessages = messages.reverse();

    if (!formattedMessages.length) {
      console.log(`No new posts in "${channelHumanName}" channel`);
    } else {
      console.log(`Parsing "${channelHumanName}" channel started`);

      // 1. группируем сообщения
      const groups = new Map<number | string, Api.Message[]>();

      for (const msg of formattedMessages) {
        const key = msg.groupedId?.toString() ?? msg.id.toString();

        if (!groups.has(key)) {
          groups.set(key, []);
        }

        groups.get(key)?.push(msg);
      }

      const parsedGroups = [...groups.values()];

      // 2. обрабатываем группы последовательно
      await processGroups(parsedGroups, undefined, { channel_id });

      console.log(`Parsing "${channelHumanName}" channel done\n\n`);
    }

    if (channels[index + 1]) {
      return await fetchChannel(index + 1);
    }

    console.log(`Parsing COMPLETE`);

    clearInterval(requestDelay);

    requestDelay = setTimeout(() => fetchChannel(), 2 * 1000 * 60);
  };

  await fetchChannel();
};

async function processGroups(groups: Api.Message[][], index: number = 0, params: { channel_id: PostInfo['channel_id'] }) {
  await processGroup(groups[index], params);

  if (groups[index + 1]) {
    return await processGroups(groups, index + 1, params);
  }
}

async function processGroup(group: Api.Message[], params: { channel_id: PostInfo['channel_id'] }) {
  let lastChannelPostId: number | undefined = undefined;

  try {
    lastChannelPostId = (await getPost({ where: { channel_id: params.channel_id }, defaults: { channel_id: params.channel_id } }))?.last_post_id || 0;
  } catch (e) {
    return 'ERROR';
  }
  // const files = new Set<string>();

  // let caption = '';

  // const downloadFunc = async (index: number = 0) => {
  //   const msg = group[index];

  //   console.log('download started');

  //   if (!caption && msg.message) {
  //     caption = msg.message;
  //   }

  //   if (msg.media) {
  //     try {
  //       const filePath = await userBot.downloadMedia(msg.media, {
  //         outputFile: environment.MEDIA_DIR,
  //       });

  //       if (filePath) {
  //         files.add(filePath as string);
  //       }
  //     } catch (err) {
  //       console.error(`Ошибка скачивания ${msg.id}`, err);
  //     }
  //   }

  //   if (group[index + 1]) {
  //     return await downloadFunc(index + 1);
  //   }

  //   console.log('download complete');

  //   return { msg, msgs: group.map((g) => g.id) };
  // };

  // const { msg, msgs } = await downloadFunc();

  // const formattedFiles = [...files].reverse();

  try {
    // 1. отправка
    // if (formattedFiles.length <= 1 || caption.length > 500) {

    const messageIds = group.map((message) => message.id);
    const last_post_id = messageIds[messageIds.length - 1];

    await userBot.forwardMessages(environment.HUB_ID, { messages: messageIds, fromPeer: params.channel_id, dropAuthor: true });
    // } else if (!!formattedFiles.length) {
    //   const file = formattedFiles.length === 1 ? formattedFiles[0] : formattedFiles;

    //   console.log(file, caption, msg.entities);

    //   await userBot.sendFile(environment.HUB_ID, { file, caption, formattingEntities: msg.entities });
    // } else {
    //   await userBot.sendMessage(environment.HUB_ID, { message: caption, formattingEntities: msg.entities });
    // }

    if (lastChannelPostId) {
      await updatePost({ channel_id: params.channel_id }, { last_post_id });
    }
  } finally {
    // 2. очистка ВСЕХ файлов после публикации
    // await cleanupFiles(formattedFiles);
  }
}

async function cleanupFiles(files: string[]) {
  for (const file of files) {
    try {
      await unlink(file);
    } catch (err) {
      console.error(`Не удалось удалить файл ${file}`, err);
    }
  }
}
