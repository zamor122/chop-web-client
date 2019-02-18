// @flow
/* global SyntheticEvent, SyntheticKeyboardEvent, TimeoutID, IntervalID */
import React, { Component } from 'react';

import type { SharedUserType } from '../feed/dux';

import { isIOS } from '../util';

import Button from '../components/button';
import InputField from '../components/inputField';
import UpArrow from '../../assets/large-arrow-up.svg';
import styles from './styles.css';

type ChatProps = {
  publishMessage: (channel: string, text: string, user: SharedUserType) => void,
  toggleChatFocus: (focused: boolean) => void,
  toggleHideVideo: (hidden: boolean) => void,
  focused: boolean,
  currentPlaceholder: string,
  currentUser: SharedUserType,
  currentChannel: string,
  initialState?: ChatState,
};

type ChatState = {
  chatInput: string,
  windowHeight: number,
  keyboardHeight: number,
};

class Chat extends Component<ChatProps, ChatState> {
  preventScrollTimer: TimeoutID | null;
  pollKeyboardInterval: IntervalID | null;
  pollCount: number;

  constructor (props: ChatProps) {
    super(props);
    // $FlowFixMe
    this.onTextEntered = this.onTextEntered.bind(this);
    // $FlowFixMe
    this.onKeyPressed = this.onKeyPressed.bind(this);
    // $FlowFixMe
    this.onBlur = this.onBlur.bind(this);
    // $FlowFixMe
    this.onFocus = this.onFocus.bind(this);
    // $FlowFixMe
    this.preventScroll = this.preventScroll.bind(this);
    // $FlowFixMe
    this.sendMessage = this.sendMessage.bind(this);

    this.preventScrollTimer = null;
    this.pollKeyboardInterval = null;
    this.pollCount = 0;

    if (props.initialState) {
      this.state = props.initialState;
    } else {
      this.state = {
        chatInput: '',
        windowHeight: 0,
        keyboardHeight: 0,
      };
    }

    if (isIOS()) {
      window.addEventListener('scroll', this.preventScroll);
    }
  }

  componentDidMount () {
    this.setState({
      windowHeight: window.innerHeight,
    });
  }


  onTextEntered (event: SyntheticEvent<HTMLInputElement>) {
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        chatInput: event.target.value,
      });
    }
  }

  onKeyPressed (event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (event.charCode === 13 && this.state.chatInput.length > 0) {
      this.props.publishMessage(
        this.props.currentChannel,
        this.state.chatInput,
        this.props.currentUser
      );
      this.setState({chatInput: ''});
    }
  }

  preventScroll () {
    if (this.preventScrollTimer) {
      window.clearTimeout(this.preventScrollTimer);
    }

    this.preventScrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 30);
  }

  pollForKeyboard  = () => {
    const { windowHeight } = this.state;
    this.pollCount = 0;

    this.pollKeyboardInterval = setInterval(() => {
      const newHeight = window.innerHeight;

      if (this.pollCount > 100) {
        clearInterval(this.pollKeyboardInterval);
      }

      if (newHeight < windowHeight) {
        const keyboard = windowHeight - newHeight;

        this.setWrapperHeight(keyboard);

        this.setState({
          keyboardHeight: keyboard,
        });

        clearInterval(this.pollKeyboardInterval);
      }

      this.pollCount += 1;
    }, 0);
  };

  setWrapperHeight = (keyboardHeight:number) => {
    const wrapper: ?HTMLElement = document.querySelector('#wrapper');
    if (wrapper && wrapper instanceof HTMLElement) {
      wrapper.style.height = `calc(100% - ${keyboardHeight}px)`;
    }
  };

  onFocus () {
    const { keyboardHeight } = this.state;
    this.props.toggleChatFocus(true);

    if (isIOS()) {
      this.props.toggleHideVideo(true);
      if (keyboardHeight > 0) {
        this.setWrapperHeight(keyboardHeight);
      } else {
        this.pollForKeyboard();
      }
    }
  }

  onBlur () {
    this.props.toggleChatFocus(false);

    if (isIOS()) {
      this.props.toggleHideVideo(false);
      const wrapper: ?HTMLElement = document.querySelector('#wrapper');
      if (wrapper && wrapper instanceof HTMLElement) {
        wrapper.style.height = '100%';
      }
      clearInterval(this.pollKeyboardInterval);
    }
  }

  sendMessage () {
    const {
      publishMessage,
      currentUser,
      currentChannel,
    } = this.props;

    publishMessage(currentChannel, this.state.chatInput, currentUser);
    this.setState({chatInput: ''});
  }

  componentWillUnmount (): void {
    window.removeEventListener('scroll', this.preventScroll);
    clearInterval(this.pollKeyboardInterval);
    clearTimeout(this.preventScrollTimer);
  }

  render () {
    const {
      focused = false,
      currentPlaceholder,
    } = this.props;

    const style = focused ? styles.focused : styles.default;

    return (
      <div className={styles.background}>
        <div className={style}>
          <InputField
            type='chat'
            onChange={this.onTextEntered}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            value={this.state.chatInput}
            placeholder={currentPlaceholder}
            enterDetect={this.onKeyPressed}
          />

          <Button
            buttonId='chat-button'
            onClick={this.sendMessage}
            keepFocus={true}
            image={UpArrow}
            buttonStyle="icon"
            imageType="arrow"
            disabled={!this.state.chatInput}
            additionalStyles={styles.sendMessage}
          />
        </div>
      </div>
    );
  }
}

export default Chat;
