// @flow
import type {
  ToggleMessageTrayType,
  DeleteMessageType,
  ToggleCloseTrayButtonType,
  ReceiveMomentType,
  PublishAcceptedPrayerRequestType,
  ReceiveAcceptedPrayerRequestType,
} from '../moment';

import type {
  AddMomentToChannelType,
  MomentType,
} from '../moment/dux';

import type {
  PublishReactionActionType,
  ReactionType,
} from '../reactions/reactionButton/dux';

import type {
  AnchorMomentType,
  PublishSalvationType,
  ReleaseAnchorMomentType,
} from '../anchorMoment/dux';

import {
  TOGGLE_MESSAGE_TRAY,
  DELETE_MESSAGE,
  MESSAGE,
  PUBLISH_ACCEPTED_PRAYER_REQUEST,
  RECEIVE_ACCEPTED_PRAYER_REQUEST,
  PUBLISH_MOMENT_TO_CHANNEL,
  RECEIVE_MOMENT,
} from '../moment';

import {
  SET_PANE_CONTENT,
} from '../pane/dux';

import type {
  PaneType,
  SetPaneType,
} from '../pane/dux';

import {
  PUBLISH_REACTION,
} from '../reactions/reactionButton/dux';

import {
  OPEN_SIDE_MENU,
  CLOSE_SIDE_MENU,
} from '../sideMenu/dux';

import { SET_CHAT_FOCUS } from '../chat/dux';
import type { SetChatFocusType } from '../chat/dux';

import { SET_VIDEO, TOGGLE_HIDE_VIDEO } from '../videoFeed/dux';
import type { SetVideoType, VideoType, ToggleHideVideoType } from '../videoFeed/dux';

import {TOGGLE_NAV_MENU_EXPANDED} from '../navMenu/dux';
import type {ToggleNavMenuExpandedType} from '../navMenu/dux';

import {
  RELEASE_ANCHOR_MOMENT,
  SET_ANCHOR_MOMENT,
} from '../anchorMoment/dux';

import {
  TOGGLE_POP_UP_MODAL,
  SET_POP_UP_MODAL,
} from '../popUpModal/dux';

import type {
  PopUpModalType,
} from '../popUpModal/dux';

import type { BannerType } from '../banner/dux';
import { SET_BANNER, CLEAR_BANNER } from '../banner/dux';

import { SET_LANGUAGE } from '../languageSelector/dux';
import {
  getPublicChannel,
  getHostChannel,
  getCurrentChannel,
  getChannelById,
} from '../selectors/channelSelectors';

import dayjs from 'dayjs';

import { EVENT } from '../pane/content/event/dux';
import { CHAT } from '../pane/content/chat/dux';

import type {
  DateTimeType,
  ChannelIdType,
} from '../cwc-types';

import type { SetNavbarIndexType } from '../navbar/dux';

import {
  SET_NAVBAR_INDEX,
} from '../navbar/dux';
import type {
  SharedSubscriberType,
} from '../subscriber/dux';

import { BASIC_AUTH_LOGIN_FAILED, REMOVE_LOGIN_ERROR } from '../login/dux';

import { createUid } from '../util';
import { ADD_MOMENT_TO_CHANNEL } from '../moment/dux';
import { HOST_INFO } from '../hostInfo/dux';
import { BIBLE, type TabType} from '../pane/content/tab/dux';
import { SCHEDULE } from '../schedule/dux';
import { EVENT_NOTES } from '../eventNotes/dux';
import { createSelector } from 'reselect';

// Action Types

const ADD_CHANNEL = 'ADD_CHANNEL';
const REMOVE_CHANNEL = 'REMOVE_CHANNEL';
const LEAVE_CHANNEL_SUCCEEDED = 'LEAVE_CHANNEL_SUCCEEDED';
const LEAVE_CHANNEL_FAILED = 'LEAVE_CHANNEL_FAILED';
const LEAVE_CHANNEL = 'LEAVE_CHANNEL';
const REMOVE_REACTION = 'REMOVE_REACTION';
const RECEIVE_REACTION = 'RECEIVE_REACTION';
const SET_ORGANIZATION = 'SET_ORGANIZATION';
const SET_PUBNUB_KEYS = 'SET_PUBNUB_KEYS';
const SET_LANGUAGE_OPTIONS = 'SET_LANGUAGE_OPTIONS';
const LOAD_HISTORY = 'LOAD_HISTORY';
const SET_SALVATIONS = 'SET_SALVATIONS';
const UPDATE_SCROLL_POSITION = 'UPDATE_SCROLL_POSITION';
const SET_SAW_LAST_MOMENT_AT = 'SET_SAW_LAST_MOMENT_AT';
const SET_CHANNELS = 'SET_CHANNELS';
const JOIN_CHANNEL = 'JOIN_CHANNEL';
const JOIN_CHANNEL_FAILED = 'JOIN_CHANNEL_FAILED';
const SET_CHANNEL_MESSAGE = 'SET_CHANNEL_MESSAGE';
const CLEAR_CHANNEL_MESSAGE = 'CLEAR_CHANNEL_MESSAGE';
const ADD_CHANNEL_SUBSCRIBER = 'ADD_CHANNEL_SUBSCRIBER';
const REMOVE_CHANNEL_SUBSCRIBER = 'REMOVE_CHANNEL_SUBSCRIBER';

// Flow Type Definitions
type LanguageType = {
  name: string,
  code: string,
};

type OrganizationThemeType = {
  headerBackgroundColor?: string,
  headerMenuIconColor?: string,
};

type OrganizationType = {
  id: number,
  name: string,
  logoUrl: string,
  theme: OrganizationThemeType,
};

type SetOrganizationType = {
  type: 'SET_ORGANIZATION',
  organization: OrganizationType,
};

type PubnubKeysType = {
  publish: string,
  subscribe: string,
};

type RemoveReactionType = {
  type: 'REMOVE_REACTION',
  id: string,
}

type ReceiveReactionType = {
  type: 'RECEIVE_REACTION',
  reaction: ReactionType,
}

type ChannelTypeType = 'prayer' | 'host' | 'direct' | 'legacy' | 'public';

type ChannelType = {
  id: string,
  name: string,
  type: ChannelTypeType,
  direct: boolean,
  placeholder: boolean,
  moments: Array<MomentType>,
  subscribers: Array<SharedSubscriberType>,
  anchorMoments: Array<AnchorMomentType>,
  scrollPosition: number,
  sawLastMomentAt: DateTimeType,
  message?: string,
};

type ChannelsObjectType = {
  [string]: ChannelType,
};

type NavType = {
  expanded: boolean,
};

type FeedType = {
  pubnubKeys: PubnubKeysType,
  organization: OrganizationType,
  channels: ChannelsObjectType,
  isPopUpModalVisible: boolean,
  focusedChannel: string,
  isSideMenuClosed: boolean,
  isVideoHidden: boolean,
  isLanguageSelectorVisible: boolean,
  isVideoPlaying: boolean,
  video: VideoType,
  currentLanguage: string,
  languageOptions: Array<LanguageType>,
  reactions: Array<ReactionType>,
  salvations: number,
  notificationBanner: BannerType,
  sequence: any,
  panes: {
    [string]: PaneType,
  },
  tabs: Array<TabType>,
  navbarIndex: number,
  prevNavbarIndex?: number,
  lastAction?: FeedActionTypes,
  popUpModal: PopUpModalType,
  nav: NavType,
  tabs: Array<TabType>,
};

type AddChannelType = {
  type: 'ADD_CHANNEL',
  channel: ChannelType,
};

type RemoveChannelType = {
  type: 'REMOVE_CHANNEL',
  channel: string,
};

type SetChannelsType = {
  type: typeof SET_CHANNELS,
  channels: ChannelsObjectType,
}

type LeaveChannelType = {
  type: 'LEAVE_CHANNEL',
  channel: string,
};

type SetChannelMessageType = {
  type: 'SET_CHANNEL_MESSAGE',
  id: string,
  message: string,
};

type ClearChannelMessageType = {
  type: 'CLEAR_CHANNEL_MESSAGE',
  id: string,
};

type SetLanguageOptionsType = {
  type: 'SET_LANGUAGE_OPTIONS',
  languageOptions: Array<LanguageType>,
};

type SetPubnubKeysType = {
  type: 'SET_PUBNUB_KEYS',
  publish: string,
  subscribe: string,
};

type LoadHistoryType = {
  type: 'LOAD_HISTORY',
  channel: string,
  moments: Array<MomentType>,
};

type SetSalvationsType = {
  type: 'SET_SALVATIONS',
  count: number,
};

type UpdateScrollPositionType = {
  type: 'UPDATE_SCROLL_POSITION',
  scrollPosition: number,
  channel: string,
  timestamp: number,
};

type SetSawLastMomentAt = {
  type: typeof SET_SAW_LAST_MOMENT_AT,
  timestamp: DateTimeType,
  channelId: ChannelIdType,
};

type JoinChannelType = {
  type: typeof JOIN_CHANNEL,
  channel: string,
  requesterId: string,
  requesterNickname: string,
};

type AddChannelSubscriberType = {
  type: typeof ADD_CHANNEL_SUBSCRIBER,
  channelId: string,
  subscriber: SharedSubscriberType,
};

type RemoveChannelSubscriberType = {
  type: typeof REMOVE_CHANNEL_SUBSCRIBER,
  channelId: string,
  subscriberId: string,
};

export type FeedActionTypes =
  | ReceiveMomentType
  | AddChannelType
  | RemoveChannelType
  | ToggleMessageTrayType
  | DeleteMessageType
  | ToggleCloseTrayButtonType
  | PublishAcceptedPrayerRequestType
  | ReceiveAcceptedPrayerRequestType
  | PublishReactionActionType
  | RemoveReactionType
  | ReceiveReactionType
  | SetVideoType
  | SetOrganizationType
  | SetPubnubKeysType
  | LeaveChannelType
  | PublishSalvationType
  | ReleaseAnchorMomentType
  | SetSalvationsType
  | SetSawLastMomentAt
  | ToggleHideVideoType
  | SetNavbarIndexType
  | SetPaneType
  | ToggleNavMenuExpandedType
  | SetChatFocusType
  | SetChannelsType
  | AddMomentToChannelType
  | SetChannelMessageType
  | ClearChannelMessageType;

// Action Creators

const setLanguageOptions = (languageOptions: Array<LanguageType>): SetLanguageOptionsType => (
  {
    type: SET_LANGUAGE_OPTIONS,
    languageOptions,
  }
);

const setOrganization = (id: number, name: string, logoUrl: string, theme: OrganizationThemeType): SetOrganizationType => (
  {
    type: SET_ORGANIZATION,
    organization: {
      id,
      name,
      logoUrl,
      theme,
    },
  }
);

const setPubnubKeys = (publish: string, subscribe: string): SetPubnubKeysType => (
  {
    type: SET_PUBNUB_KEYS,
    publish,
    subscribe,
  }
);

const removeReaction = (id: string): RemoveReactionType => (
  {
    type: REMOVE_REACTION,
    id,
  }
);

const addChannel = (
  name: string,
  id: string,
  type: ChannelTypeType,
  direct: boolean,
  subscribers?: Array<SharedSubscriberType> = [],
  placeholder?: boolean = false,
): AddChannelType => (
  {
    type: ADD_CHANNEL,
    channel: {
      id,
      name,
      type,
      direct,
      placeholder,
      moments: [],
      subscribers,
      anchorMoments: [],
      scrollPosition: 0,
      sawLastMomentAt: Date.now(),
    },
  }
);

const addPlaceholderChannel = (
  otherSubscriber:SharedSubscriberType
): AddChannelType => (
  {
    type: ADD_CHANNEL,
    channel: {
      id: createUid(),
      name: 'Direct',
      type: 'direct',
      direct: true,
      placeholder: true,
      moments: [],
      subscribers: [otherSubscriber],
      anchorMoments: [],
      scrollPosition: 0,
      sawLastMomentAt: Date.now(),
    },
  }
);

const removeChannel = (channel: string): RemoveChannelType => (
  {
    type: REMOVE_CHANNEL,
    channel,
  }
);

const setChannels = (
  channels: ChannelsObjectType,
): SetChannelsType => (
  {
    type: SET_CHANNELS,
    channels,
  }
);

const joinChannel = (channel: string, requesterId: string, requesterNickname: string):JoinChannelType => (
  {
    type: JOIN_CHANNEL,
    channel,
    requesterId,
    requesterNickname,
  }
);

const leaveChannel = (channel: string): LeaveChannelType => (
  {
    type: LEAVE_CHANNEL,
    channel,
  }
);

const setChannelMessage = (id: string, message: string): SetChannelMessageType => (
  {
    type: SET_CHANNEL_MESSAGE,
    id,
    message,
  }
);

const clearChannelMessage = (id: string): ClearChannelMessageType => (
  {
    type: CLEAR_CHANNEL_MESSAGE,
    id,
  }
);

const loadHistory = (moments: Array<MomentType>, channel: string): LoadHistoryType => (
  {
    type: LOAD_HISTORY,
    channel,
    moments,
  }
);

const setSalvations = (count:number): SetSalvationsType => (
  {
    type: SET_SALVATIONS,
    count,
  }
);

const addChannelSubscriber = (channelId:string, subscriber:SharedSubscriberType): AddChannelSubscriberType => (
  {
    type: ADD_CHANNEL_SUBSCRIBER,
    channelId,
    subscriber,
  }
);

const removeChannelSubscriber = (channelId:string, subscriberId:string): RemoveChannelSubscriberType => (
  {
    type: REMOVE_CHANNEL_SUBSCRIBER,
    channelId,
    subscriberId,
  }
);

const updateScrollPosition = (scrollPosition: number, channel: string, timestamp: number): UpdateScrollPositionType => (
  {
    type: UPDATE_SCROLL_POSITION,
    scrollPosition,
    channel,
    timestamp,
  }
);

const defaultState = {
  pubnubKeys: {
    publish: '',
    subscribe: '',
  },
  organization: {
    id: 0,
    name: '',
    logoUrl: '',
    theme: {
      headerBackgroundColor: '',
      headerMenuIconColor: '',
    },
  },
  channels: {},
  isPopUpModalVisible: false,
  focusedChannel: '',
  isSideMenuClosed: true,
  isVideoHidden: false,
  isLanguageSelectorVisible: false,
  isVideoPlaying: false,
  video: {
    type: 'none',
    url: '',
  },
  currentLanguage: 'en-US',
  languageOptions: [
    {
      code: 'en-US',
      name: 'English',
    },
    {
      code: 'zh-CN',
      name: 'Chinese',
    },
    {
      code: 'fr',
      name: 'French',
    },
    {
      code: 'es',
      name: 'Spanish',
    },
    {
      code: 'de',
      name: 'German',
    },
    {
      code: 'it',
      name: 'Italian',
    },
    {
      code: 'ko',
      name: 'Korean',
    },
  ],
  panes: {
    primary: {
      type: EVENT,
      content: {
        channelId: 'event',
      },
    },
  },
  reactions: [],
  notificationBanner: {
    type: '',
    key: '',
    variables: {},
  },
  sequence: {
    steps: [],
  },
  salvations: 0,
  persistExpiresAt: dayjs().add(1, 'month').format(),
  navbarIndex: 0,
  prevNavbarIndex: undefined,
  popUpModal: {},
  nav: {
    expanded: true,
  },
  tabs: [
    HOST_INFO,
    EVENT_NOTES,
    BIBLE,
    SCHEDULE,
  ],
};

// Reducer

const reducer = (
  inboundState: FeedType = defaultState,
  action?: FeedActionTypes): FeedType => {
  if (!action || !action.type) {
    return inboundState;
  }
  const state = {
    ...inboundState,
    lastAction: { ...action},
  };
  switch (action.type) {
    case SET_PANE_CONTENT: {
      const currentChannel = getCurrentChannel(state);
      if (currentChannel === 'event' || currentChannel === '') {
        return {
          ...state,
          panes: {
            ...state.panes,
            [action.name]: action.pane,
          },
        };
      } else {
        return {
          ...state,
          channels: {
            ...state.channels,
            [currentChannel]: {
              ...state.channels[currentChannel],
              sawLastMomentAt: state.channels[currentChannel] &&
                state.channels[currentChannel].sawLastMomentAt > 0 ?
                state.channels[currentChannel].sawLastMomentAt : new Date().getTime(),
            },
          },
          panes: {
            ...state.panes,
            [action.name]: action.pane,
          },
        };
      }
    }
    case SET_LANGUAGE_OPTIONS:
      return {
        ...state,
        languageOptions: action.languageOptions,
      };
    case SET_PUBNUB_KEYS:
      return {
        ...state,
        pubnubKeys: {
          publish: action.publish,
          subscribe: action.subscribe,
        },
      };
    case SET_ORGANIZATION:
      return {
        ...state,
        organization: action.organization,
      };
    case RECEIVE_MOMENT: {
    // $FlowFixMe
      const { channel:channelId, moment }: { channelId: string, moment: MomentType } = action;
      if (state.channels[channelId]) {
        return {
          ...state,
          channels: {
            ...state.channels,
            [channelId]: {
              ...state.channels[channelId],
              moments: [
                ...state.channels[channelId].moments,
                moment,
              ],
            },
          },
        };
      }
      return state;
    }
    case ADD_CHANNEL:
      if (state.channels[action.channel.id]) {
        return state;
      }
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channel.id]: action.channel,
        },
      };
    case LEAVE_CHANNEL:
    case REMOVE_CHANNEL: {
      const { channel: deletedChannelId } = action;
      const { [deletedChannelId]: _channel, ...updatedChannels } = state.channels;
      const publicChannelId = getPublicChannel(state);
      const hostChannelId = getHostChannel(state);
      const currentChannelId = getCurrentChannel(state);

      const publicChannelPane = {
        type: EVENT,
        content: {
          channelId: publicChannelId,
        },
      };

      const hostChannelPane = {
        type: CHAT,
        content: {
          channelId: hostChannelId,
        },
      };

      let newPane = {
        type: EVENT,
        content: {
          channelId: 'event',
        },
      };

      if (deletedChannelId === currentChannelId) {
        if (deletedChannelId === publicChannelId && hostChannelId) {
          newPane = hostChannelPane;
        } else if (publicChannelId) {
          newPane = publicChannelPane;
        }
      }

      return {
        ...state,
        channels: updatedChannels,
        panes: {
          ... state.panes,
          primary: newPane,
        },
      };
    }
    case SET_CHANNELS:
      return {
        ...state,
        channels: action.channels,
      };
    case SET_CHANNEL_MESSAGE: {
      // $FlowFixMe
      const channel = getChannelById(state, action.id);
      return {
        ...state,
        channels: {
          ...state.channels,
          [channel.id]: {
            ...channel,
            message: action.message,
          },
        },
      };
    }
    case CLEAR_CHANNEL_MESSAGE: {
      // $FlowFixMe
      const channel = getChannelById(state, action.id);
      return {
        ...state,
        channels: {
          ...state.channels,
          [channel.id]: {
            ...channel,
            message: '',
          },
        },
      };
    }
    case LOAD_HISTORY:
      if (state.channels[action.channel]) {
        return {
          ...state,
          channels: {
            ...state.channels,
            [action.channel]: {
              ...state.channels[action.channel],
              moments: [
                ...state.channels[action.channel].moments,
                ...action.moments,
              ],
            },
          },
        };
      }
      return state;
    case TOGGLE_MESSAGE_TRAY: {
      // $FlowFixMe
      const { channel, id } = action;
      if (state.channels[channel]) {
        return {
          ...state,
          channels: {
            ...state.channels,
            [channel]: {
              ...state.channels[channel],
              moments: state.channels[channel].moments.map(
                message => {
                  if (message.id === id) {
                    return {
                      ...message,
                      messageTrayOpen: !message.messageTrayOpen,
                    };
                  } else {
                    return {
                      ...message,
                      messageTrayOpen: false,
                    };
                  }
                }
              ),
            },
          },
        };
      } else {
        return state;
      }
    }
    case PUBLISH_ACCEPTED_PRAYER_REQUEST:
    case RECEIVE_ACCEPTED_PRAYER_REQUEST: {
    // $FlowFixMe
      const { prayerChannel, hostChannel, cancelled } = action;
      const messageIndex = state.channels[hostChannel].moments.findIndex(el => (
        el.prayerChannel === prayerChannel && el.active === true
      ));
      if (messageIndex >= 0) {
        return {
          ...state,
          channels: {
            ...state.channels,
            [hostChannel]: {
              ...state.channels[hostChannel],
              moments: [
                ...state.channels[hostChannel].moments.slice(0, messageIndex),
                {
                  ...state.channels[hostChannel].moments[messageIndex],
                  active: false,
                  cancelled: cancelled,
                },
                ...state.channels[hostChannel].moments.slice(messageIndex + 1),
              ],
            },
          },
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case DELETE_MESSAGE: {
    // $FlowFixMe
      const { id, channel } = action;
      const { channels } = state;
      const messageIndex = channels[channel].moments.findIndex(el => (
        el.id === id
      ));
      return {
        ...state,
        channels: {
          ...channels,
          [channel]: {
            ...channels[channel],
            moments: [
              ...channels[channel].moments.slice(0, messageIndex),
              ...channels[channel].moments.slice(messageIndex + 1),
            ],
          },
        },
      };
    }
    case ADD_MOMENT_TO_CHANNEL:
    case PUBLISH_MOMENT_TO_CHANNEL: {
      // $FlowFixMe
      if (action.moment.type === MESSAGE) {
        if ([action.moment.text].toString().length > 0) {
          return {
            ...state,
            channels: {
              ...state.channels,
              // $FlowFixMe
              [action.channel]: {
                // $FlowFixMe
                ...state.channels[action.channel],
                moments: [
                  // $FlowFixMe
                  ...state.channels[action.channel].moments,
                  // $FlowFixMe
                  action.moment,
                ],
              },
            },
          };
        }
      }
      return {
        ...state,
        channels: {
          ...state.channels,
          // $FlowFixMe
          [action.channel]: {
          // $FlowFixMe
            ...state.channels[action.channel],
            moments: [
            // $FlowFixMe
              ...state.channels[action.channel].moments,
              // $FlowFixMe
              action.moment,
            ],
          },
        },
      };
    }
    case SET_ANCHOR_MOMENT: {
      const { channel, anchorMoment } = action;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channel]: {
            ...state.channels[channel],
            anchorMoments: [
              ...state.channels[channel].anchorMoments,
              anchorMoment,
            ],
          },
        },
      };
    }
    case RELEASE_ANCHOR_MOMENT: {
      const { channels } = state;
      const { id, channel } = action;
      const messageIndex = channels[channel].anchorMoments.findIndex(el => (
        el.id === id
      ));
      const moment = channels[channel].anchorMoments.find(anchorMoment => anchorMoment.id === id);
      return {
        ...state,
        channels: {
          ...state.channels,
          [channel]: {
            ...state.channels[channel],
            moments: [
              ...state.channels[channel].moments,
              moment,
            ],
            anchorMoments: [
              ...channels[channel].anchorMoments.slice(0, messageIndex),
              ...channels[channel].anchorMoments.slice(messageIndex + 1),
            ],
          },
        },
      };
    }
    case TOGGLE_POP_UP_MODAL: {
      return {
        ...state,
        isPopUpModalVisible: !state.isPopUpModalVisible,
        // $FlowFixMe
        popUpModal: action.modal,
      };
    }
    case SET_POP_UP_MODAL: {
      return {
        ...state,
        // $FlowFixMe
        popUpModal: action.modal,
        isPopUpModalVisible: true,
      };
    }
    case BASIC_AUTH_LOGIN_FAILED: {
      return {
        ...state,
        // $FlowFixMe
        popUpModal: {
          ...state.popUpModal,
          error: true,
        },
      };
    }
    case REMOVE_LOGIN_ERROR: {
      return {
        ...state,
        // $FlowFixMe
        popUpModal: {
          ...state.popUpModal,
          error: false,
        },
      };
    }
    case SET_CHAT_FOCUS:
      return {
        ...state,
        focusedChannel: action.channel,
      };
    case TOGGLE_HIDE_VIDEO:
      return {
        ...state,
        isVideoHidden: action.hidden,
      };
    case CLOSE_SIDE_MENU:
      return {
        ...state,
        isSideMenuClosed: true,
      };
    case OPEN_SIDE_MENU:
      return {
        ...state,
        isSideMenuClosed: false,
      };
    case SET_VIDEO:
      return {
        ...state,
        video: action.video,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.language,
      };
    case PUBLISH_REACTION:
    case RECEIVE_REACTION:
      return {
        ...state,
        reactions: [...state.reactions, action.reaction],
      };
    case REMOVE_REACTION: {
      const { id } = action;
      return {
        ...state,
        reactions: state.reactions.filter(reaction => reaction.id !== id),
      };
    }
    case SET_SALVATIONS:
      return {
        ...state,
        salvations: action.count,
      };
    case SET_BANNER:
      return {
        ...state,
        notificationBanner: action.banner,
      };
    case CLEAR_BANNER:
      return {
        ...state,
        notificationBanner: defaultState.notificationBanner,
      };
    case UPDATE_SCROLL_POSITION: {
      const { scrollPosition, channel, timestamp } = action;
      if (!state.channels[channel]) {
        return state;
      }
      return {
        ...state,
        channels: {
          ...state.channels,
          [channel]: {
            ...state.channels[channel],
            scrollPosition: scrollPosition,
            sawLastMomentAt: scrollPosition < 10 ? timestamp : state.channels[channel].sawLastMomentAt,
          },
        },
      };
    }
    case TOGGLE_NAV_MENU_EXPANDED:
      return {
        ...state,
        nav: {
          ...state.nav,
          expanded: !state.nav.expanded,
        },
      };
    case 'PLAY_VIDEO':
      return {
        ...state,
        isVideoPlaying: true,
      };
    case 'PAUSE_VIDEO':
      return {
        ...state,
        isVideoPlaying: false,
      };
    case SET_NAVBAR_INDEX:
      return {
        ...state,
        navbarIndex: action.index,
        prevNavbarIndex: state.navbarIndex,
      };
    case ADD_CHANNEL_SUBSCRIBER:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            subscribers: [
              ...state.channels[action.channelId].subscribers,
              action.subscriber,
            ],
          },
        },
      };
    case REMOVE_CHANNEL_SUBSCRIBER: {
      if (state.channels[action.channelId]?.subscribers) {
        const subscribers = state.channels[action.channelId].subscribers.filter(subscriber => subscriber.id !== action.subscriberId);
        return {
          ...state,
          channels: {
            ...state.channels,
            [action.channelId]: {
              ...state.channels[action.channelId],
              subscribers: [
                subscribers,
              ],
            },
          },
        };
      } else {
        return {
          ...state,
        };
      }
    }
    default:
      return inboundState;
  }
};

// Selectors

const getNotificationBanner = (state: FeedType): BannerType => (
  local(state).notificationBanner
);

//$FlowFixMe
const local = state => state.feed || state;

export const getCurrentOrganization = createSelector(
  local,
  feed => feed.organization,
);

// Exports

export {
  ADD_CHANNEL,
  REMOVE_CHANNEL,
  LEAVE_CHANNEL,
  LEAVE_CHANNEL_SUCCEEDED,
  LEAVE_CHANNEL_FAILED,
  SET_CHANNELS,
  JOIN_CHANNEL,
  JOIN_CHANNEL_FAILED,
};
export {
  defaultState,
  addChannel,
  removeChannel,
  joinChannel,
  addPlaceholderChannel,
  leaveChannel,
  removeReaction,
  setOrganization,
  setLanguageOptions,
  setPubnubKeys,
  loadHistory,
  setSalvations,
  updateScrollPosition,
  setChannels,
  local,
  getNotificationBanner,
  setChannelMessage,
  clearChannelMessage,
  addChannelSubscriber,
  removeChannelSubscriber,
};

export type {
  AddChannelType,
  RemoveChannelType,
  MomentType,
  FeedType,
  ChannelType,
  LeaveChannelType,
  LanguageType,
  OrganizationType,
  SetSalvationsType,
  ChannelsObjectType,
  JoinChannelType,
  ChannelTypeType,
};

export default reducer;
