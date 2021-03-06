// @flow
import { call, put, select, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import queries from '../queries';
import type {
  GraphQLCurrentStateType,
  GraphQLEventType,
  GraphQLChannelType,
  GraphQLEventAtType,
  GraphQLVideoType,
  GraphQLSequenceType,
} from '../queries';
import {
  setPubnubKeys,
  setOrganization,
  setLanguageOptions,
  setChannels,
} from '../../feed/dux';
import { QUERY_CURRENT_EVENT_FAILED, setEvent, isOffline } from '../../event/dux';
import {
  setSchedule,
  QUERY_SCHEDULE_FAILED,
} from '../../schedule/dux';
import bugsnagClient from '../../util/bugsnag';
import { avatarImageExists } from '../../util';
import { getLanguageCount } from '../../selectors/languageSelector';
import { setVideo } from '../../videoFeed/dux';
import type { ChannelsObjectType } from '../../feed/dux';
import { convertSubscriber } from './privateChat';
import { COMPACT } from '../../textModeToggle/dux';
import { startTimer } from './sequence';
import { setSubscriber } from '../../subscriber/dux';
import { PRIMARY_PANE } from '../../pane/dux';
import { setPaneToEvent } from '../../pane/content/event/dux';
import { getPublicChannel } from '../../selectors/channelSelectors';
import { theme } from '../../styles';
import { API } from '../API';
import { heartbeat } from './metrics';

export type GeoWhereLocationType = {|
  country_code: string,
  country_name: string,
  region: string,
  city: string,
  latitude: string,
  longitude: string,
  ip: string,
  gdpr: boolean,
|};

const isTimeInFuture = (seconds: number): boolean => (seconds * 1000) > Date.now();

const convertChannel = (channels: Array<GraphQLChannelType>): ChannelsObjectType => {
  const channelsObj = {};
  channels.forEach(channel => {
    channelsObj[channel.id] = {
      ...channel,
      subscribers: channel.subscribers && channel.subscribers.length > 0 ? channel.subscribers.map(convertSubscriber) : [],
      moments: [],
      anchorMoments: [],
      scrollPosition: 0,
      sawLastMomentAt: Date.now(),
      placeholder: false,
    };
  });
  return channelsObj;
};

function* currentEvent (): Saga<void> {
  const languageCount = yield select(getLanguageCount);
  const needLanguages = languageCount === 0;
  try {
    const result: GraphQLCurrentStateType = yield call([queries, queries.currentState], needLanguages);
    yield* dispatchData(result);
    const channelId = yield select(getPublicChannel);
    yield put(setPaneToEvent(PRIMARY_PANE, channelId));
    yield fork(startTimer);
    yield fork(heartbeat);
  } catch (error) {
    yield put({type: QUERY_CURRENT_EVENT_FAILED, error: error.message});
    bugsnagClient.notify(error);
  }
}

function* dispatchData (data: GraphQLCurrentStateType): Saga<void> {
  yield* pubnubKeys(data);
  yield* currentSubscriber(data);
  yield* organization(data);
  yield* languageOptions(data);
  yield* event(data);
  yield* schedule(data);
}

function* pubnubKeys (data: GraphQLCurrentStateType): Saga<void> {
  if (data.pubnubKeys) {
    const { pubnubKeys: { publishKey, subscribeKey } } = data;
    yield put(setPubnubKeys(publishKey, subscribeKey));
  }
}

function* currentSubscriber (data:GraphQLCurrentStateType): Saga<void> {
  const { currentSubscriber } = data;
  if (currentSubscriber) {
    yield put(
      setSubscriber(
        {
          userId: currentSubscriber.userId,
          id: currentSubscriber.id,
          nickname: currentSubscriber.nickname || '',
          avatar: currentSubscriber.avatar,
          firstName: currentSubscriber.firstName || '',
          lastName: currentSubscriber.lastName || '',
          email: currentSubscriber.email || '',
          phoneNumber: currentSubscriber.phoneNumber || '',
          pubnubAccessKey: currentSubscriber.pubnubAccessKey || '',
          role: {
            label: currentSubscriber?.role?.label || '',
            permissions: currentSubscriber?.role?.permissions ? currentSubscriber.role.permissions.map(permission => permission.key) : [],
          },
          preferences: {
            textMode: currentSubscriber?.preferences?.textMode || COMPACT,
          },
        }
      )
    );
    const exists = yield call(avatarImageExists, currentSubscriber.id.toString());
    if (exists) {
      yield put(
        {
          type: 'SET_AVATAR',
          url: `https://chop-v3-media.s3.amazonaws.com/users/avatars/${currentSubscriber.id}/thumb/photo.jpg`,
        }
      );
    }
    try {
      const locationData:GeoWhereLocationType = yield call([API, API.get], '/where', 'https://geo.life.church');
      if (locationData) {
        yield call([queries, queries.updateSubscriber], currentSubscriber.id, {
          countryCode: locationData.country_code,
          countryName: locationData.country_name,
          region: locationData.region,
          city: locationData.city,
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
          ip: locationData.ip,
          gdpr: locationData.gdpr,
        });
      }
    } catch (error) {
      // This is okay, it's non-critical data
    }
  }
}

function* organization (data: GraphQLCurrentStateType): Saga<void> {
  if (data.currentOrganization) {
    const { currentOrganization: { id, name, logoUrl, theme:queryTheme } } = data;
    const organizationTheme = {
      headerBackgroundColor: queryTheme?.headerBackgroundColor || theme.colors.gray5,
      headerMenuIconColor: queryTheme?.headerMenuIconColor || theme.colors.gray50,
    };
    yield put(setOrganization(id, name || '', logoUrl || '', organizationTheme));
  }
}

function* languageOptions (data: GraphQLCurrentStateType): Saga<void> {
  if (data.currentLanguages) {
    const { currentLanguages } = data;
    yield put(setLanguageOptions(currentLanguages));
  }
}

export function* event (data: GraphQLCurrentStateType): Saga<void> {
  const { currentEvent: event } = data;
  if (event) {
    yield* eventMain(event);
    yield* sequence(event.sequence);
    yield* channels(event.feed);
    yield* video(event.video);
  }
}

export function* eventAt (event: GraphQLEventAtType): Saga<void> {
  if (event) {
    yield* eventMain(event);
    yield* channels(event.feed);
    yield* video(event.video);
  }
}

function* eventMain (event: GraphQLEventAtType | GraphQLEventType): Saga<void> {
  yield put(
    setEvent(
      event.title || '',
      event.id || '',
      event.eventTime.id || '',
      event.startTime || 0,
      event.endTime || 0,
      event.scheduleTime || 0,
      event.videoStartTime || 0,
      event.speaker || '',
      event.description || '',
      event.hostInfo || '',
      event.enabledFeatures || { chat: false },
      event.eventNotes || '',
    )
  );
}

export function* sequence (sequence: GraphQLSequenceType): Saga<void> {
  if (sequence?.steps?.length > 0) {
    const now = Date.now();
    const updatedSequence = {
      ...sequence,
      steps: sequence.steps.filter(step =>
        step.transitionTime * 1000 > now),
    };
    yield put(
      {
        type: 'SET_SEQUENCE',
        sequence: updatedSequence,
      }
    );
  }
}

function* channels (channels: Array<GraphQLChannelType>): Saga<void> {
  if (channels) {
    yield put(setChannels(convertChannel(channels)));
    const [publicChannel] = channels.filter(channel => channel.type === 'public');
    if (publicChannel) {
      yield put(setPaneToEvent(PRIMARY_PANE, publicChannel.id));
    }
  }
}

function* video (video: GraphQLVideoType): Saga<void> {
  if (video) {
    yield put(
      setVideo(
        video.url || '',
        video.type || 'none',
      )
    );
  }
}

function* schedule (data: GraphQLCurrentStateType): Saga<void> {
  const { schedule } = data;
  if (schedule) {
    const isBetweenEvents = yield select(isOffline);
    const futureScheduleEvents = schedule.filter(event => {
      if (event.startTime && event.endTime && event.fetchTime && event.scheduleTime) {
        return isTimeInFuture(event.startTime);
      } else {
        bugsnagClient.notify(new Error(`Scheduled event ${event.id} has either, startTime, endTime, fetchTime or scheduleTime as null`));
        return false;
      }
    });

    yield put(setSchedule(futureScheduleEvents.map(event => (
      {
        id: event.id,
        startTime: event.startTime || 0,
        endTime: event.endTime || 0,
        title: event.title || '',
        fetchTime: event.fetchTime || 0,
        scheduleTime: event.scheduleTime || 0,
        hostInfo: event.hostInfo || '',
      }
    ))));

    if (isBetweenEvents) {
      const [nextEvent] = schedule;
      if (nextEvent && nextEvent.startTime) {
        try {
          const result = yield call([queries, queries.sequence], nextEvent.startTime);
          yield* sequence(result);
        } catch (error) {
          yield put({type: QUERY_SCHEDULE_FAILED, error: error.message});
          bugsnagClient.notify(error);
        }
      }
    }
  }
}

export {
  currentEvent,
  dispatchData,
};
