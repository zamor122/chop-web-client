// @flow
import type {
  PublishMessageAction,
  ChatInputAction,
} from '../chat/dux';

import type {
  MessageType,
  OpenMessageTrayType,
  CloseMessageTrayType,
  DeleteMessageType,
  ToggleCloseTrayButtonType,
  MomentType,
} from '../moment';

import type { SetUser } from '../io/chat/dux';

import type { AnchorMomentType } from '../placeholder/anchorMoment/dux';

import {
  PUBLISH_MESSAGE,
  CHAT_INPUT,
} from '../chat/dux';

import {
  createMessage,
  OPEN_MESSAGE_TRAY,
  CLOSE_MESSAGE_TRAY,
  DELETE_MESSAGE,
  TOGGLE_CLOSE_TRAY_BUTTON,
} from '../moment';

import {
  PUBLISH_MOMENT_TO_CHANNEL,
} from '../moment/dux';

import { SET_USER } from '../io/chat/dux';

import {
  RELEASE_ANCHOR_MOMENT,
  SET_ANCHOR_MOMENT,
} from '../placeholder/anchorMoment/dux';

// Action Types
const CHANGE_CHANNEL = 'CHANGE_CHANNEL';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';//RECEIVE
const ADD_CHANNEL = 'ADD_CHANNEL';
const REMOVE_CHANNEL = 'REMOVE_CHANNEL';

// Flow Type Definitions

type UserType = {
  id: string,
  nickname: string,
};

type MomentTypeList = Array<MomentType>;

type FeedType = {
  channels: {
    [string]: MomentTypeList,
  },
  currentChannel: string,
  chatInput: string,
  currentUser: UserType,
  appendingMessage: boolean,
  anchorMoment: AnchorMomentType | null,
  animatingMoment: boolean,
  placeholderPresent: boolean,
};

type ChangeChannelType = {
  type: 'CHANGE_CHANNEL',
  channel: string
};

type ReceiveMessageType = {
  type: 'RECEIVE_MESSAGE',
  channel: string,
  message: MessageType,
};

type AddChannelType = {
  type: 'ADD_CHANNEL',
  channel: string,
};

type RemoveChannelType = {
  type: 'REMOVE_CHANNEL',
  channel: string,
};

type FeedActionTypes =
  | ChangeChannelType
  | PublishMessageAction
  | ReceiveMessageType
  | AddChannelType
  | RemoveChannelType
  | ChatInputAction
  | SetUser
  | OpenMessageTrayType
  | CloseMessageTrayType
  | DeleteMessageType
  | ToggleCloseTrayButtonType;

// Action Creators

const changeChannel = (newChannel: string): ChangeChannelType => (
  {
    type: CHANGE_CHANNEL,
    channel: newChannel,
  }
);

const receiveMessage = (channel: string, message: MessageType): ReceiveMessageType => (
  {
    type: RECEIVE_MESSAGE,
    channel,
    message,
  }
);

const addChannel = (channel: string): AddChannelType => (
  {
    type: ADD_CHANNEL,
    channel,
  }
);

const removeChannel = (channel: string): RemoveChannelType => (
  {
    type: REMOVE_CHANNEL,
    channel,
  }
);

// Default State

const defaultState = {
  channels: {
    public: [],
    host: [],
  },
  currentChannel: 'public',
  chatInput: '',
  currentUser: {
    id: '',
    nickname: '',
  },
  appendingMessage: false,
  anchorMoment: null,
  animatingMoment: true,
  placeholderPresent: false,
};

// Reducer

const reducer = (
  state: FeedType = defaultState,
  action?: FeedActionTypes): FeedType => {
  if (!action || !action.type) {
    return state;
  }
  switch (action.type) {
  case CHANGE_CHANNEL:
    if (!state.channels[action.channel]) {
      return state;
    }
    return {
      ...state,
      appendingMessage: false,
      currentChannel: action.channel,
    };
  case PUBLISH_MESSAGE:
    if ([state.chatInput].toString().length > 0) {
      return {
        ...state,
        appendingMessage: true,
        animatingMoment: true,
        channels: {
          ...state.channels,
          [state.currentChannel]: [
            ...state.channels[state.currentChannel],
            createMessage(action.id, state.chatInput, state.currentUser, false, false),
          ],
        },
        chatInput: '',
      };
    }
    return state;
  case RECEIVE_MESSAGE:
    return {
      ...state,
      appendingMessage: false,
      animatingMoment: true,
      channels: {
        ...state.channels,
        [action.channel]: [
          ...state.channels[action.channel],
          action.message,
        ],
      },
    };
  case ADD_CHANNEL:
    if (state.channels[action.channel]) {
      return state;
    }
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: [],
      },
    };
  case REMOVE_CHANNEL: {
    if (action.channel === 'public' ||
      action.channel === 'host') {
      return state;
    }
    const stateCopy = {...state};
    if (action.channel === state.currentChannel) {
      stateCopy.currentChannel = 'public';
    }
    delete stateCopy.channels[action.channel];
    return stateCopy;
  }
  case CHAT_INPUT: 
    return {
      ...state,
      chatInput: action.value,
    };
  case SET_USER: 
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        id: action.id,
        nickname: action.nickname,
      },
    };
  case OPEN_MESSAGE_TRAY: {
    const { id } = action;
    return {
      ...state,
      channels: {
        ...state.channels,
        [state.currentChannel]: state.channels[state.currentChannel].map(
          message => (
            {
              ...message,
              messageTrayOpen: message.id === id,
            }
          )
        ),
      },
    };
  }
  case CLOSE_MESSAGE_TRAY: {
    const { id } = action;
    return {
      ...state,
      channels: {
        ...state.channels,
        [state.currentChannel]: state.channels[state.currentChannel].map(
          message => (
            {
              ...message,
              messageTrayOpen: message.id === id ? false : null,
            }
          )
        ),
      },
    };
  }
  case TOGGLE_CLOSE_TRAY_BUTTON: {
    const { id } = action;
    return {
      ...state,
      channels: {
        ...state.channels,
        [state.currentChannel]: state.channels[state.currentChannel].map(
          message => (
            {
              ...message,
              closeTrayButtonRendered: message.id === id ? !message.closeTrayButtonRendered : null,
            }
          )
        ),
      },
    };
  }
  case DELETE_MESSAGE: {
    const { id } = action;
    const { channels, currentChannel } = state;
    const messageIndex = channels[currentChannel].findIndex(el => (
      el.id === id
    ));
    return {
      ...state,
      channels: {
        ...channels,
        [currentChannel]: [
          ...channels[currentChannel].slice(0, messageIndex),
          ...channels[currentChannel].slice(messageIndex + 1),
        ],
      },
    };
  }
  case PUBLISH_MOMENT_TO_CHANNEL: {
    return {
      ...state,
      animatingMoment: true,
      channels: {
        ...state.channels,
        [action.channel]: [
          ...state.channels[action.channel],
          action.moment,
        ],
      },
    };
  }
  case SET_ANCHOR_MOMENT:
    return {
      ...state,
      placeholderPresent: true,
      anchorMoment: action.anchorMoment,
    };
  case RELEASE_ANCHOR_MOMENT:
    return {
      ...state,
      placeholderPresent: false,
      animatingMoment: false,
      channels: {
        ...state.channels,
        [action.channel]: [
          ...state.channels[action.channel],
          state.anchorMoment,
        ],
      },
      anchorMoment: null,
    };
  default:
    return state;
  }
};

// Selectors

const feedContents = (state: FeedType): Array<MessageType> => (
  state.channels[state.currentChannel]
);

const appendMessage = (state: FeedType) => (
  state.appendingMessage
);

// Exports

export {
  CHANGE_CHANNEL,
  RECEIVE_MESSAGE,
  ADD_CHANNEL,
  REMOVE_CHANNEL,
};
export {
  changeChannel,
  receiveMessage,
  addChannel,
  removeChannel,
  feedContents,
  defaultState,
  appendMessage,
};
export type {
  ReceiveMessageType,
  ChangeChannelType,
  UserType,
  FeedType,
  RemoveChannelType,
};

export default reducer;
