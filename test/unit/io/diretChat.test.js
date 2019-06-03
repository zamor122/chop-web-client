// @flow
import queries from '../../../src/io/queries';
import {directChat} from '../../../src/io/saga';
import { runSaga } from 'redux-saga';
import {
  DIRECT_CHAT,
  DIRECT_CHAT_FAILED,
} from '../../../src/moment/message/dux';
import {ADD_CHANNEL} from '../../../src/feed/dux';
import {mockDate} from '../../testUtils';

jest.mock('../../../src/io/queries');
const mock = (mockFn: any) => mockFn;

describe('Test Direct Chat', () => {
  const mockDirectChat = mock(queries.directChat);
  test('Direct Chat subscriber success', async () => {
    mockDate(1553266446136);
    const dispatched = [];

    await runSaga({
      dispatch: action => dispatched.push(action),
    }, directChat,
    {type: DIRECT_CHAT, otherSubscriberId: '12345', otherSubscriberNickname: 'James T. Kirk'}).toPromise();

    expect(mockDirectChat).toBeCalledWith('12345', 'James T. Kirk');
    expect(dispatched).toEqual([
      {
        type: ADD_CHANNEL,
        channel: {
          direct: true,
          placeholder: false,
          id: '67890',
          type: 'direct',
          name: null,
          anchorMoments: [],
          moments: [],
          subscribers: [
            {
              id: '123',
              avatar: null,
              nickname: 'Fred',
              role: { label: '' },
            },
            {
              id: '456',
              avatar: null,
              nickname: 'Barny',
              role: { label: '' },
            },
          ],
          scrollPosition: 0,
          sawLastMomentAt: 1553266446136,
        },
      },
      {
        name: 'primary',
        pane: {
          content: {
            channelId: '67890',
          },
          type: 'CHAT',
        },
        type: 'SET_PANE_CONTENT',
      },
    ]);
  });

  test('Direct Chat subscriber failure', async () => {
    mockDirectChat.mockImplementation(() => {
      throw new Error('Broken');
    });
    const dispatched = [];

    await runSaga({
      dispatch: action => dispatched.push(action),
    }, directChat,
    {type: DIRECT_CHAT, otherSubscriberId: '12345', otherSubscriberNickname: 'James T. Kirk'}).toPromise();

    expect(mockDirectChat).toBeCalledWith('12345', 'James T. Kirk');
    expect(dispatched).toEqual([
      {
        type: DIRECT_CHAT_FAILED,
        error: 'Broken',
      },
    ]);
  });
});
