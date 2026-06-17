import { initUserBot } from './telegram/userBot';
import { parseChannelCommentUsers } from './telegram/userBot/parsedUsers';
import { initInviteUsers, massInitInviteUsers } from './telegram/userBot/invite';
import { initServer } from './server';

(async () => {
  console.clear();

  await initServer();

  await initUserBot();

  // await initInviteUsers();

  // await massInitInviteUsers();

  // await parseChannelCommentUsers();

  // await watchChannels();
})();
