// @flow
import ChatActor from '../../src/io/chat';
import { mockRequest } from 'graphql-request';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { defaultState } from '../../src/chop/dux';
import testData from './io/test-data.json';
import accessToken from './io/access-token.json';
import { __messageEvent } from 'pubnub';

jest.mock('../../src/io/location');
jest.mock('graphql-request');
jest.mock('../../src/io/queries');
jest.mock('pubnub');

Enzyme.configure({ adapter: new Adapter() });

describe('Test delete message', () => {
  const message = {
    channelToken: 'test',
    umt: '123456',
  };
  global.document.cookie  = 'legacy_token=12345; ';
  mockRequest.mockResolvedValueOnce(accessToken);
  mockRequest.mockResolvedValueOnce(testData);
  const moments = [
    {
      type: 'MESSAGE',
      id: '123456',
      lang: 'en',
      text: 'hi',
      subscriber: {
        id: 1234,
        avatar: null,
        nickname: 'Tony Hoare',
        role: { label: '' },
        preferences: { textMode: 'COMPACT' },
      },
      messageTrayOpen: false,
    },
    {
      type: 'MESSAGE',
      id: '789012',
      lang: 'en',
      text: 'hey',
      subscriber: {
        id: 1234,
        avatar: null,
        nickname: 'Shaq O.',
        firstName: 'Shaq',
        lastName: `O' Neil`,
        email: 'shaq@size24.com',
        phoneNumber: '',
        role: { label: '' },
        preferences: { textMode: 'COMPACT' },
      },
      messageTrayOpen: false,
    },
  ];

  test('Receive delete message notification and delete message', () => {
    const store = {
      ...defaultState,
      subscriber: {
        ...defaultState.subscriber,
        currentSubscriber: {
          id: '12234',
          avatar: null,
          pubnubAccessKey: '09876',
          nickname: 'Shaq O.',
          firstName: 'Shaq',
          lastName: `O' Neil`,
          email: 'shaq@size24.com',
          phoneNumber: '',
          role: {
            label: '',
            permissions: [],
          },
          preferences: {
            textMode: 'COMPACT',
          },
        },
      },
      feed: {
        ...defaultState.feed,
        organization: {
          id: 2,
          name: 'Life.Church',
          logoUrl: '',
          theme: {
            headerBackgroundColor: '',
            headerMenuIconColor: '',
          },
        },
        pubnubKeys: {
          publish: 'pub-c-1d485d00-14f5-4078-9ca7-19a6fe6411a7',
          subscribe: 'sub-c-1dc5ff9a-86b2-11e8-ba2a-d686872c68e7',
        },
        channels: {
          ...defaultState.feed.channels,
          test: {
            name: 'test',
            id: 'test',
            direct: false,
            moments: moments,
            anchorMoments: [],
            scrollPosition: 0,
            sawLastMomentAt: 1546896104521,
          },
        },
      },
    };

    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue(store);

    const chat = new ChatActor(dispatch, getState);

    chat.init();

    __messageEvent(
      {
        channel: 'test',
        message: {
          action: 'muteMessage',
          channel: 'test',
          data: message,
        },
      }
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0]).toEqual(
      {
        type: 'DELETE_MESSAGE',
        channel: 'test',
        id: '123456',
      }
    );
  });
});
