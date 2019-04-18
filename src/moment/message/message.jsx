// @flow
import React from 'react';

import type { MessageType } from './dux';
import type { SharedUserType } from '../../users/dux';
import Avatar from '../../avatar';

import OpenTrayButtonIcon from '../../../assets/open-tray-button.svg';
import MessageTray from '../../components/messageTray';
import Actionable from '../../components/Actionable';
import linkifyHtml from 'linkifyjs/html';
import { sanitizeString } from '../../util';
import Label from '../../components/label';

import { MessageWrapper, Wrapper, BodyWrapper, NameWrapper, OpenTrayButton, TextWrapper, AnimatedMessageTray } from './styles';
import { useTransition } from 'react-spring';

type MessagePropsType = {
  message: MessageType,
  currentChannel: string,
  openMessageTray: (channel: string, id: string) => void,
  closeMessageTray: (channel: string, id: string) => void,
  deleteMessage: (id: string, channel: string) => void,
  publishDeleteMessage: (id: string) => void,
  muteUser: (user: string) => void,
  addPlaceholderChannel: (otherUser: SharedUserType) => string,
  setPaneToChat: (channelId: string) => void,
};

const Message = (
  props: MessagePropsType
) => {
  const {
    message: {
      sender,
      messageTrayOpen,
      text,
      id:messageId,
    },
    currentChannel,
  } = props;

  const { name: senderName, role: { label: senderLabel } = {} } = sender;
  const renderText = linkifyHtml(text, { target: '_blank' });

  const openMessageTray = () => props.openMessageTray(currentChannel, messageId);
  const closeMessageTray = () => messageTrayOpen ? props.closeMessageTray(currentChannel, messageId) : undefined;
  const deleteMessage = () => {
    props.publishDeleteMessage(messageId);
    props.deleteMessage(messageId, currentChannel);
  };
  const muteUser = () => {
    props.muteUser(senderName);
    closeMessageTray();
  };
  const addPlaceholderChannel = () => {
    const channelId = props.addPlaceholderChannel(sender);
    props.setPaneToChat(channelId);
    closeMessageTray();
  };

  const OpenMessageTrayButton = () => (
    <Actionable onClick={openMessageTray} keepFocus={true}>
      <OpenTrayButton
        dangerouslySetInnerHTML={{ __html: OpenTrayButtonIcon }}
      />
    </Actionable>
  );

  const MessageBody = () => (
    <>
      <Avatar user={sender} />
      <BodyWrapper>
        <NameWrapper>{senderName}</NameWrapper>
        {senderLabel &&
          <Label text={senderLabel} />
        }
        <TextWrapper key={messageId} data-node='text' dangerouslySetInnerHTML={{ __html: sanitizeString(renderText) }} />
      </BodyWrapper>
    </>
  );

  const transitions = useTransition(messageTrayOpen, null, {
    from: { transform:  'translate3d(316px,0,0)' },
    enter: { transform: 'translate3d(8px,0,0)' },
    leave: { transform: 'translate3d(316px,0,0)' },
  });

  return (
    <Wrapper data-testid='messageContainer'>
      <Actionable onClick={closeMessageTray} keepFocus={true} tabable={false}>
        <MessageWrapper messageTrayOpen={messageTrayOpen}>
          <MessageBody />
          <OpenMessageTrayButton />
        </MessageWrapper>
      </Actionable>

      { transitions.map(({ item, props, key }) => (
        item &&
          <AnimatedMessageTray style={props} key={key}>
            <MessageTray
              deleteMessage={deleteMessage}
              muteUser={muteUser}
              directChat={addPlaceholderChannel}
              closeTray={closeMessageTray}
            />
          </AnimatedMessageTray>
      ))}

    </Wrapper>
  );
};

export default React.memo < MessagePropsType > (Message);
