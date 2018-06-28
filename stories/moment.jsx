// @flow
/* global module */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { storiesOf } from '@storybook/react';

import { createMessage } from '../src/moment';

import Moment from '../src/moment/moment';
import '../assets/global.css';

const store = createStore(() => {});

storiesOf('Moment', module)
  .add('Message tray closed', () => (
    <Provider store={store}>
      <Moment
        data={
          createMessage(
            '1234',
            'Maecenas sed diam eget risus varius blandit sit amet non magna.',
            {
              id: '12345',
              nickname: 'Billy Bob',
            },
            false,
          )
        }
      />
    </Provider>
  ))
  .add('Message tray open', () => (
    <Provider store={store}>
      <Moment
        data={
          createMessage(
            '1234',
            'Maecenas sed diam eget risus varius blandit sit amet non magna.',
            {
              id: '12345',
              nickname: 'Billy Bob',
            },
            true,
          )
        }
      />
    </Provider>
  ))
  .add('Live prayer notification', () => (
    <Provider store={store}>
      <Moment
        data={
          {
            type: 'PUBLISH_MOMENT_TO_CHANNEL',
            channel: 'host',
            moment: {
              type: 'NOTIFICATION',
              notificationType: 'PRAYER',
              host: 'Pickle',
              guest: 'Cucumber',
              timeStamp: '9:33pm',
            },
          }
        }
      />
    </Provider>
  ))
  .add('Joined chat notification', () => (
    <Provider store={store}>
      <Moment
        data={
          {
            type: 'PUBLISH_MOMENT_TO_CHANNEL',
            channel: 'host',
            moment: {
              type: 'NOTIFICATION',
              notificationType: 'JOINED_CHAT',
              name: 'Pickle',
              timeStamp: '9:33pm',
            },
          }
        }
      />
    </Provider>
  ))
  .add('Left chat notification', () => (
    <Provider store={store}>
      <Moment
        data={
          {
            type: 'PUBLISH_MOMENT_TO_CHANNEL',
            channel: 'host',
            moment: {
              type: 'NOTIFICATION',
              notificationType: 'LEFT_CHAT',
              name: 'Pickle',
              timeStamp: '9:33pm',
            },
          }
        }
      />
    </Provider>
  ));