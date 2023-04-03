import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ThemeContext from 'terra-theme-context';
import styles from './Slide.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * If true, the Slide is marked as hidden using accessibility attributes.
   */
  isHidden: PropTypes.bool,

  /**
   * The components to display inside the Slide.
   */
  children: PropTypes.node,

  /**
   * The aria label for the Slide.
   */
  slideAriaLabel: PropTypes.string,
};

const defaultProps = {
  isHidden: false,
};

const Slide = (props) => {
  const [lastClicked, setLastClicked] = useState(null);
  const [enteredAfterHidden, setEnteredAfterHidden] = useState(false);

  useEffect(() => {
    if (!props.isHidden && lastClicked) {
      setEnteredAfterHidden(true);
      lastClicked.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isHidden]);

  const handleClick = (event) => {
    setEnteredAfterHidden(false);
    setLastClicked(event.target);
  };

  const theme = React.useContext(ThemeContext);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id="slide-div"
      role={enteredAfterHidden ? 'region' : undefined}
      aria-label={enteredAfterHidden ? `${props.slideAriaLabel} inner panel div` : undefined}
      className={cx('slide', theme.className)}
      aria-hidden={props.isHidden || null}
      onClick={handleClick}
      onKeyUp={handleClick}
    >
      <div className={cx('slide-shadow')} />
      {props.children}
    </div>
  );
};

Slide.propTypes = propTypes;
Slide.defaultProps = defaultProps;

export default Slide;
