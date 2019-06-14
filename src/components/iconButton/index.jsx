// @flow
import * as React from 'react';
import Actionable from '../Actionable';
import Button from './styles';

type IconButtonPropsType = {
  children: React.Node,
  size: number,
  onClick: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onMouseEnter?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onMouseLeave?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  background?: string,
  keepFocus?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  id?: string,
};

const IconButton = React.forwardRef(({
  children,
  size,
  onClick,
  onMouseEnter,
  onMouseLeave,
  background = 'none',
  keepFocus,
  disabled,
  hidden,
  id,
}:IconButtonPropsType, ref) => (
  <Actionable onClick={onClick} keepFocus={keepFocus}>
    <Button
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      size={size}
      data-testid={id}
      disabled={disabled}
      hidden={hidden}
      background={background}
    >
      { children }
    </Button>
  </Actionable>
));

IconButton.displayName = 'IconButton';

export default React.memo < IconButtonPropsType > (IconButton);
