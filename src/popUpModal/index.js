// @flow
import { connect } from 'react-redux';

import {
  togglePopUpModal,
  removeChannel,
} from '../feed/dux';
import { publishLeftChannelNotification } from '../moment/notification/dux';

import {
  getOtherUsers,
} from '../selectors/chatSelectors';

import PopUpModal from './popUpModal';

const mapStateToProps = state => {
  const feedState = state.feed;
  return {
    isPopUpModalVisible: feedState.isPopUpModalVisible,
    otherUser: getOtherUsers(feedState, feedState.currentChannel)[0],
    currentUser: feedState.currentUser,
    currentChannel: feedState.currentChannel,
  };
};

const mapDispatchToProps = dispatch => (
  {
    togglePopUpModal: () => (dispatch(togglePopUpModal())),
    removeChannel: channelName => (dispatch(removeChannel(channelName))),
    publishLeftChannelNotification: (name, pubnubToken, channel, date) => (dispatch(publishLeftChannelNotification(name, pubnubToken, channel, date))),
  }
);

const VisiblePopUpModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpModal);

export default VisiblePopUpModal;
