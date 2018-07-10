// @flow
import reducer, { defaultState } from '../../src/placeholder/dux';

import {
  publishSalvation,
  releaseAnchorMoment,
} from '../../src/placeholder/anchorMoment/dux';

describe('PlaceHolder tests', () => {
  test('Default state', () => {
    const result = reducer(defaultState);
    expect(result).toEqual(defaultState);
  });

  test('Sets salvation anchor moment 1 hand raised', () => {
    const result = reducer(defaultState, publishSalvation(1));
    expect(result.renderPlaceholder).toBe(true);
    expect(result.placeholder.length).toBe(1);
    expect(result.placeholder[0].text).toBe(
      'I commit my life to Christ.'
    );
    expect(result.placeholder[0].subText).toBe('1 hand raised');
    expect(result.placeholder[0].showReleaseAnchorButton).toBe(true);
  });

  test('Sets salvation anchor moment multiple hands raised', () => {
    const result = reducer(defaultState, publishSalvation(4));
    expect(result.renderPlaceholder).toBe(true);
    expect(result.placeholder.length).toBe(1);
    expect(result.placeholder[0].text).toBe(
      'I commit my life to Christ.'
    );
    expect(result.placeholder[0].subText).toBe('4 hands raised');
    expect(result.placeholder[0].showReleaseAnchorButton).toBe(true);
  });

  test('Release anchor moment', () => {
    const result = reducer(
      {
        ...defaultState,
        renderPlaceholder: true,
        placeholder: [
          {
            type: 'ANCHOR_MOMENT',
            id: '12345',
            text: 'I commit my life to Christ.',
            subText: '1 hand raised',
            showReleaseAnchorButton: true,
          },
        ],
      },
      releaseAnchorMoment()
    );
    expect(result.renderPlaceholder).toBe(false);
    expect(result.placeholder.length).toBe(0);
  });
});
