// @flow
import type { SharedUserType } from '../../feed/dux';
import { createUid } from '../../util';

const PUBLISH_REACTION = 'PUBLISH_REACTION';
const REACTION = 'REACTION';

type PublishReactionActionType = {
  type: 'PUBLISH_REACTION',
  reaction: ReactionType,
};

type ReactionType = {
  type: 'REACTION',
  id: string,
  user?: SharedUserType,
};

type LegacyReactionType = {
  type: 'REACTION',
  nickname: string,
  channelToken: string,
  reactionId: string,
}

const publishReaction = (currentUser: SharedUserType): PublishReactionActionType => (
  {
    type: PUBLISH_REACTION,
    reaction: createReaction(currentUser),
  }
);

const createReaction = (currentUser: SharedUserType): ReactionType => (
  {
    type: REACTION,
    id: createUid(),
    user: currentUser,
  }
);

export {
  PUBLISH_REACTION,
  publishReaction,
};

export type {
  PublishReactionActionType,
  ReactionType,
  LegacyReactionType,
};