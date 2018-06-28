// @flow
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Moment from '../../src/moment/moment';
import { Message, Notification, createMessage } from '../../src/moment';
import {
  publishPrayerNotification,
  publishJoinedChatNotification,
  publishLeftChatNotification,
} from '../../src/moment/notification/dux';
import { mockDate } from '../testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('Moment tests', () => {
  mockDate('Wed Jun 27 2018 16:53:06 GMT-0500');

  test('Moment renders', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          createMessage(
            '12345',
            'Hello',
            {
              id: '67890',
              nickname: 'Bob',
            },
            false
          )
        }
      />
    );
    expect(wrapper.find(Message).length).toBe(1);
  });

  test('Message renders', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          createMessage(
            '12345',
            'Hello',
            {
              id: '67890',
              nickname: 'Bob',
            },
            false
          )
        }
      />
    );
    expect(wrapper.find(Message).at(0).props().message).toEqual(
      {
        type: 'MESSAGE',
        id: '12345',
        text: 'Hello',
        user: {
          id: '67890',
          nickname: 'Bob',
        },
        messageTrayOpen: false,
      }
    );
  });

  test('Prayer notification renders', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          publishPrayerNotification('Billy', 'Bobby')
        }
      />
    );
    expect(wrapper.find(Notification).at(0).props()).toEqual(
      {
        notification: {
          type: 'NOTIFICATION',
          notificationType: 'PRAYER',
          host: 'Billy',
          guest: 'Bobby',
          timeStamp: '4:53pm',
        },
      }
    );
  });

  test('Joined chat notification renders public', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          publishJoinedChatNotification('Billy', 'public')
        }
      />
    );
    expect(wrapper.find(Notification).at(0).props()).toEqual(
      {
        notification: {
          type: 'NOTIFICATION',
          notificationType: 'JOINED_CHAT',
          name: 'Billy',
          timeStamp: '4:53pm',
        },
      }
    );
  });

  test('Joined chat notification renders host', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          publishJoinedChatNotification('Billy', 'host')
        }
      />
    );
    expect(wrapper.find(Notification).at(0).props()).toEqual(
      {
        notification: {
          type: 'NOTIFICATION',
          notificationType: 'JOINED_CHAT',
          name: 'Billy',
          timeStamp: '4:53pm',
        },
      }
    );
  });

  test('Left chat notification renders public', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          publishLeftChatNotification('Billy', 'public')
        }
      />
    );
    expect(wrapper.find(Notification).at(0).props()).toEqual(
      {
        notification: {
          type: 'NOTIFICATION',
          notificationType: 'LEFT_CHAT',
          name: 'Billy',
          timeStamp: '4:53pm',
        },
      }
    );
  });

  test('Left chat notification renders host', () => {
    const wrapper = Enzyme.shallow(
      <Moment
        data={
          publishLeftChatNotification('Billy', 'host')
        }
      />
    );
    expect(wrapper.find(Notification).at(0).props()).toEqual(
      {
        notification: {
          type: 'NOTIFICATION',
          notificationType: 'LEFT_CHAT',
          name: 'Billy',
          timeStamp: '4:53pm',
        },
      }
    );
  });
});