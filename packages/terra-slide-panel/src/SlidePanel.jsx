import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import ThemeContext from 'terra-theme-context';
import VisuallyHiddenText from 'terra-visually-hidden-text';
import FocusTrap from 'focus-trap-react';
import styles from './SlidePanel.module.scss';

const cx = classNamesBind.bind(styles);

const SlidePanelPositions = {
  START: 'start',
  END: 'end',
};

const propTypes = {
  /**
   * String that labels the Panel content area for screen readers.
   */
  panelAriaLabel: PropTypes.string,

  /**
   * String that labels the Main content area for screen readers.
   */
  mainAriaLabel: PropTypes.string,

  /**
   * The component to display in the main content area.
   */
  mainContent: PropTypes.node,

  /**
   * The component to display in the panel content area.
   */
  panelContent: PropTypes.node,

  /**
   * The style of panel presentation. One of `overlay`, `squish`.
   */
  panelBehavior: PropTypes.oneOf(['overlay', 'squish']),

  /**
   * The position at which the panel will be displayed. This property honors the current direction setting. One of `start`, `end`.
   */
  panelPosition: PropTypes.oneOf(['start', 'end']),

  /**
   * The size at which the panel will be displayed. One of `small`, `large`.
   */
  panelSize: PropTypes.oneOf(['small', 'large']),

  /**
   * Whether or not, when open, the panel should be displayed with the full width of the SlidePanel.
   */
  isFullscreen: PropTypes.bool,

  /**
   * Whether or not the panel should be displayed.
   */
  isOpen: PropTypes.bool,

  /**
   * Whether or not the SlidePanel should be sized relative to its parent container.
   */
  fill: PropTypes.bool,
};

const defaultProps = {
  panelBehavior: 'overlay',
  panelPosition: SlidePanelPositions.END,
  panelSize: 'small',
};

class SlidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.setPanelNode = this.setPanelNode.bind(this);
    this.mainNode = React.createRef();
    this.setLastClicked = this.setLastClicked.bind(this);
    this.setDisclosingNode = this.setDisclosingNode.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && this.props.isOpen !== prevProps.isOpen) {
      // Save the disclosing node for returning focus when panel is closed
      this.setDisclosingNode(this.lastClicked);
      this.panelNode.focus();
    } else if (!this.props.isOpen && this.props.isOpen !== prevProps.isOpen) {
      // Return focus to the disclosing element
      if (this.disclosingNode && this.disclosingNode.focus) {
        this.disclosingNode.setAttribute('aria-expanded', 'false');
        this.disclosingNode.setAttribute('aria-controls', 'slide-panel-div');
        this.disclosingNode.focus();
      }
    }
  }

  setPanelNode(node) {
    this.panelNode = node;
  }

  setLastClicked(event) {
    this.lastClicked = event.target;
  }

  setDisclosingNode(node) {
    node.setAttribute('aria-expanded', 'true');
    node.setAttribute('aria-controls', 'slide-panel-div');
    this.disclosingNode = node;
  }

  render() {
    const {
      panelAriaLabel,
      mainAriaLabel,
      mainContent,
      panelContent,
      panelBehavior,
      panelPosition,
      panelSize,
      isFullscreen,
      isOpen,
      fill,
      ...customProps
    } = this.props;

    const theme = this.context;

    const slidePanelClassNames = classNames(cx(
      'slide-panel',
      { 'is-open': isOpen },
      { 'is-fullscreen': isFullscreen },
      { fill },
      theme.className,
    ),
    customProps.className);
    const panelDiv = (
      <>
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        {/* <label
          className={cx('hidden-label')}
          htmlFor="slide-panel-div"
          id="panel-div-label"
        >
          {`${panelAriaLabel} region` || 'Panel expanded'}
        </label> */}
        {/* <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            escapeDeactivates: true,
            clickOutsideDeactivates: true,
            returnFocusOnDeactivate: false,
          }}
        > */}
        {/* <div
          className={cx('hidden-label')}
          id="a11y-panel-aria"
          aria-live="polite"
        >
          {`${panelAriaLabel} region` || 'Panel expanded'}
        </div> */}
        <div
          id="slide-panel-div"
          role="complementary"
          // aria-modal="true"
          className={cx(['panel'])}
          key="panel"
          tabIndex="-1"
          aria-labelledby="panel-hidden-text"
          aria-hidden={!isOpen ? 'true' : 'false'}
          // aria-describedby="slide-panel-manager-action-header"
          ref={this.setPanelNode}
        >
          <VisuallyHiddenText
            id="panel-hidden-text"
            text={panelAriaLabel}
          />
          {panelContent}
        </div>
        {/* </FocusTrap> */}
      </>
    );

    const mainDiv = (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions
      <div
        id="main-slide-panel-div"
        role="main"
        className={cx('main')}
        key="main"
        tabIndex="-1"
        aria-label={mainAriaLabel}
        ref={this.mainNode}
        onClick={this.setLastClicked}
        onKeyUp={this.setLastClicked}
      >
        {mainContent}
      </div>
    );

    const content = (panelPosition === SlidePanelPositions.START) ? (
      <React.Fragment>
        {isFullscreen ? (
          <FocusTrap
            active={isOpen}
            focusTrapOptions={{
              escapeDeactivates: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: false,
            }}
          >
            <div>{panelDiv}</div>
          </FocusTrap>
        ) : panelDiv}
        {mainDiv}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {mainDiv}
        {isFullscreen ? (
          <FocusTrap
            active={isOpen}
            focusTrapOptions={{
              escapeDeactivates: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: false,
            }}
          >
            <div>{panelDiv}</div>
          </FocusTrap>
        ) : panelDiv}
      </React.Fragment>
    );

    return (
      <div
        {...customProps}
        className={slidePanelClassNames}
        data-slide-panel-panel-behavior={panelBehavior}
        data-slide-panel-panel-position={panelPosition}
        data-slide-panel-panel-size={panelSize}
      >
        {content}
      </div>
    );
  }
}

SlidePanel.propTypes = propTypes;
SlidePanel.defaultProps = defaultProps;
SlidePanel.contextType = ThemeContext;

export default SlidePanel;
export { SlidePanelPositions };
