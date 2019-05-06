// @flow
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';

import SideMenu from '../../src/sideMenu/sideMenu';
import LanguageSelector from '../../src/languageSelector';
import { mountWithTheme, renderWithTheme } from '../testUtils';
import { fireEvent } from 'react-testing-library';
import {EventDescription, EventTitle, OrganizationTitle} from '../../src/sideMenu/styles';
import Avatar from '../../src/avatar';
import type {PrivateUserType} from '../../src/users/dux';

Enzyme.configure({ adapter: new Adapter() });

const languageOptions = [
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'ja-jp',
    name: 'Japanese',
  },
  {
    code: 'fr',
    name: 'French',
  },
  {
    code: 'sp',
    name: 'Spanish',
  },
  {
    code: 'gm',
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
];

const currentPane = {
  type: 'EVENT',
  content: {
    channelId: 'host',
  },
};

const currentUser: PrivateUserType = {
  id: 134,
  pubnubToken: '12sd0fj230jsdf;',
  name: 'Kylo Ren',
  avatar: 'http://someimageons3.com/image/123',
  pubnubAccessKey: '12347893456',
  role: {
    label: 'Supreme Leader of the First Order',
    permissions: ['event.event.manage'],
  },
};

describe('SideBar tests', () => {
  test('SideBar renders', () => {
    const closeFunction = () => {};
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={closeFunction}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(wrapper.find('styles__Menu').length).toBe(1);
    expect(wrapper.find('styles__Menu').props().open).toBe(true);
    expect(wrapper.find(LanguageSelector).length).toBe(1);
  });

  test('SideBar has link to guest experience', () => {
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(wrapper.find('a[data-testid="guest-experience"]').length)
      .toBe(1);
    expect(wrapper.find('a[data-testid="guest-experience"]').text())
      .toBe('guest_experience');
  });

  test('SideBar has link to give feedback', () => {
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );

    expect(wrapper.find('a[data-testid="feedback"]').length)
      .toBe(1);
    expect(wrapper.find('a[data-testid="feedback"]').text())
      .toBe('give_feedback');
    expect(wrapper.find('a[data-testid="feedback"]').props().href)
      .toBe('https://lifechurch.formstack.com/forms/host_feedback_2');
  });

  test('SideBar has logout button', () => {
    const logoutButton = sinon.spy();
    const { getByTestId } = renderWithTheme(
      <SideMenu
        logout={logoutButton}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    const logout = getByTestId('logout');
    expect(logout).toBeTruthy();
    expect(logout.textContent).toEqual('File log_out');
    fireEvent.click(logout);
    expect(logoutButton.calledOnce).toBeTruthy();
  });

  test('SideBar has organization title', () => {
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(wrapper.find(OrganizationTitle).length)
      .toBe(1);
    expect(wrapper.find(OrganizationTitle).text())
      .toBe('The Church');
  });

  test('SideBar has event information', () => {
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(wrapper.find(EventTitle).length)
      .toBe(1);
    expect(wrapper.find(EventTitle).text())
      .toBe('Event Title');
    expect(wrapper.find(EventDescription).length)
      .toBe(1);
    expect(wrapper.find(EventDescription).text())
      .toBe('The Description');
  });

  test('SideBar has avatar', () => {
    const wrapper = mountWithTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(wrapper.find(Avatar).length)
      .toBe(1);
  });
});
