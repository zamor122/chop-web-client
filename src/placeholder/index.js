// @flow
import { connect } from 'react-redux';

import { releaseAnchorMoment } from './anchorMoment/dux';
import {
  placeholderContents,
  getCurrentChannel,
  toggleAnchorMomentAnchored,
} from './dux';

import Placeholder from './placeholder';

const mapStateToProps = state => {
  const feedState = state.feed;
  return {
    anchorMoment: placeholderContents(feedState),
    isPlaceholderPresent: feedState.isPlaceholderPresent,
    currentChannel: getCurrentChannel(feedState),
    isAnchorMomentAnchored: toggleAnchorMomentAnchored(feedState),
  };
};

const mapDispatchToProps = dispatch => (
  {
    releaseAnchorMoment: () => dispatch(releaseAnchorMoment()),
  }
);

const VisiblePlaceholder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Placeholder);

export default VisiblePlaceholder;
