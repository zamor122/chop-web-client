beforeEach(() => {
  cy.server();

  cy.fixture('pubnubHistory.json').as('pubnubHistoryJSON');

  cy.route(/.*\/publish\/.*/, [1, 'Sent', '15474147248048901']);

  cy.route(/.*\/history\/.*\/channel\/998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c.*/, '@pubnubHistoryJSON').as('pubnubHistoryRoute');

  cy.visit('http://0.0.0.0:8080');

  cy
    .window()
    .its('store')
    .invoke('dispatch', {
      type: 'SET_PUBNUB_KEYS',
      publish: 'pub-c-5d166bf0-07cf-4e5b-81e6-797b7f01bf83',
      subscribe: 'sub-c-12f3b1fe-e04d-11e7-b7e7-02872c090099',
    });

  cy
    .window()
    .its('store')
    .invoke('dispatch', {
      type: 'SET_USER',
      user: {
        id: 1022905,
        nickname: 'G. Boole',
        avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
        role: {
          label: 'Admin',
          permissions: [],
        },
      },
    });

  cy
    .window()
    .its('store')
    .invoke('dispatch', {
      type: 'SET_EVENT',
      event: {
        title: 'Fake Event',
        id: '1',
        startTime: '0',
        videoStartTime: '0',
      },
    });

  cy
    .window()
    .its('store')
    .invoke('dispatch', {
      type: 'ADD_CHANNEL',
      channel: {
        id: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        name: 'Public',
        direct: false,
        moments: [],
        participants: [],
        anchorMoments: [],
        scrollPosition: 0,
        sawLastMomentAt: Date.now(),
      },
    });

  cy
    .window()
    .its('store')
    .invoke('dispatch', {
      type: 'SET_PANE_CONTENT',
      name: 'primary',
      content: {
        type: 'EVENT',
        channelId: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
      },
    });

  cy.wait('@pubnubHistoryRoute');
});

describe('Feed scrolling', () => {
  it('shows the most recent message when history loads.', () => {
    cy.get('[data-testid=feed] li:last-child').should('be.visible');
  });

  it('shows the newest message when a new message comes in if we are already scrolled to the most recent.', () => {
    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022905,
            nickname: 'G. Boole',
            avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
            role: {
              label: 'Admin',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('does not shows the newest message when a new message comes in if we are scrolled up in the feed.', () => {
    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy.get('[data-testid=feed]').scrollTo(0, 100);

    cy.wait(50); // we have to wait after scrolling since it's an async action but scrollTo does not return a Promise

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022906,
            nickname: 'Other User',
            avatar: null,
            role: {
              label: '',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('not.be.visible');
  });

  it('shows the newest message when the user sends new message comes in if we are scrolled up in the feed.', () => {
    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy.get('[data-testid=feed]').scrollTo(0, 100);

    cy.wait(50); // we have to wait after scrolling since it's an async action but scrollTo does not return a Promise

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022905,
            nickname: 'G. Boole',
            avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
            role: {
              label: 'Admin',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('returns to the bottom of the feed after changing channels.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'ADD_CHANNEL',
        channel: {
          id: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850d',
          name: 'Host',
          direct: false,
          moments: [],
          participants: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: Date.now(),
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');

    cy.get('#nav-Host').click();

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 0);

    cy.get('#nav-Public').click();

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('returns to the already set scroll position of the feed after changing channels.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'ADD_CHANNEL',
        channel: {
          id: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850d',
          name: 'Host',
          direct: false,
          moments: [],
          participants: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: Date.now(),
        },
      });

    cy.get('[data-testid=feed] ul>span').children().last().should('be.visible');

    cy.get('[data-testid=feed]').scrollTo('top');

    cy.wait(50);

    cy.get('[data-testid=feed] ul>span').children().last().should('not.be.visible');

    cy.get('#nav-Host').click();

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 0);

    cy.get('#nav-Public').click();

    cy.get('[data-testid=feed] ul>span').children().last().should('not.be.visible');
  });
});

describe('Feed scrolling with anchor moment', () => {
  it('shows the most recent message when history loads.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy.get('[data-testid=feed] li:last-child').should('be.visible');
  });

  it('shows the newest message when a new message comes in if we are already scrolled to the most recent.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022905,
            nickname: 'G. Boole',
            avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
            role: {
              label: 'Admin',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('does not shows the newest message when a new message comes in if we are scrolled up in the feed.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy.get('[data-testid=feed]').scrollTo(0, 100);

    cy.wait(50); // we have to wait after scrolling since it's an async action but scrollTo does not return a Promise

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022906,
            nickname: 'Other User',
            avatar: null,
            role: {
              label: '',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('not.be.visible');
  });

  it('shows the newest message when the user sends new message comes in if we are scrolled up in the feed.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 12);

    cy.get('[data-testid=feed]').scrollTo(0, 100);

    cy.wait(50); // we have to wait after scrolling since it's an async action but scrollTo does not return a Promise

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'PUBLISH_MOMENT_TO_CHANNEL',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        moment: {
          type: 'MESSAGE',
          id: 'db3d0f79-824d-4e46-94d5-0aedca429b9e',
          timestamp: 1547486695817,
          lang: 'en',
          text: 'This is a new message',
          sender: {
            id: 1022905,
            nickname: 'G. Boole',
            avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
            role: {
              label: 'Admin',
            },
          },
          messageTrayOpen: false,
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('returns to the bottom of the feed after changing channels.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'ADD_CHANNEL',
        channel: {
          id: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850d',
          name: 'Host',
          direct: false,
          moments: [],
          participants: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: Date.now(),
        },
      });

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');

    cy.get('#nav-Host').click();

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 0);

    cy.get('#nav-Public').click();

    cy.get('[data-testid=feed] ul>span').children().as('feedList');
    cy.get('@feedList').last().should('be.visible');
  });

  it('returns to the already set scroll position of the feed after changing channels.', () => {
    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_ANCHOR_MOMENT',
        channel: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850c',
        anchorMoment: {
          type: 'ANCHOR_MOMENT',
          anchorMomentType: 'SALVATION',
          id: '123345',
        },
      });

    cy
      .window()
      .its('store')
      .invoke('dispatch', {
        type: 'ADD_CHANNEL',
        channel: {
          id: '998056925ead69f1f74047e57a8a84622db90754f9776257a80525d84860850d',
          name: 'Host',
          direct: false,
          moments: [],
          participants: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: Date.now(),
        },
      });

    cy.get('[data-testid=feed] ul>span').children().last().should('be.visible');

    cy.get('[data-testid=feed]').scrollTo('top');

    cy.wait(50);

    cy.get('[data-testid=feed] ul>span').children().last().should('not.be.visible');

    cy.get('#nav-Host').click();

    cy.get('[data-testid=feed] ul>span').children().should('have.length', 0);

    cy.get('#nav-Public').click();

    cy.get('[data-testid=feed] ul>span').children().last().should('not.be.visible');
  });
});
