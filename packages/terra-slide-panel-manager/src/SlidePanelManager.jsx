import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import ActionHeader from 'terra-action-header';
import ContentContainer from 'terra-content-container';
import DisclosureManager, { availableDisclosureSizes } from 'terra-disclosure-manager';
import SlideGroup from 'terra-slide-group';
import SlidePanel from 'terra-slide-panel';

const disclosureType = 'panel';
export { disclosureType };

const propTypes = {
  /**
   * The components to be rendered in the body of the SlidePanelManager. These components will receive the
   * disclosure capabilities through the DisclosureManger's context API.
   */
  children: PropTypes.node,
  /**
   * The desired panel behavior. Either 'squish' or 'overlay'.
   */
  panelBehavior: PropTypes.oneOf(['overlay', 'squish']),
  /**
 * The aria label for the panel region.
  */
  panelAriaLabel: PropTypes.string,
  /**
  * The aria label when returning to the main region.
  */
  mainAriaLabel: PropTypes.string,
  /**
   * The component to render within the panel above the disclosed content.
   */
  disclosureAccessory: PropTypes.element,
  /**
   * @private
   * The container to wrap the disclosed content. This should be provided from the application level.
   */
  withDisclosureContainer: PropTypes.func,
};

const defaultProps = {
  panelBehavior: 'overlay',
  mainAriaLabel: 'Default main aria label',
};

/**
 * The SlidePanel component does not support the full range of DisclosureManager sizes in its API. The potential sizes are mapped to the
 * SlidePanel's supported sizes.
 */
const disclosureSizeToPanelSize = {
  [availableDisclosureSizes.TINY]: 'small',
  [availableDisclosureSizes.SMALL]: 'small',
  [availableDisclosureSizes.MEDIUM]: 'large',
  [availableDisclosureSizes.LARGE]: 'large',
  [availableDisclosureSizes.HUGE]: 'large',
};

const disclosureDimensionsToPanelSize = (dimensions) => {
  if (dimensions.width > 480 || dimensions.height > 600) {
    return 'large';
  }
  return 'small';
};

function SlidePanelManager(props) {
  const panelRef = useRef(null);

  const handleFocus = () => {
    console.log(panelRef.current);
    panelRef?.current?.focus();
  };

  const PanelContainer = React.forwardRef((panelContainerProps, ref) => {
    console.log(ref);
    return (
      <span ref={ref} tabIndex="-1">
        <ContentContainer
          fill
          header={(
            <React.Fragment>
              {panelContainerProps.headerDataForPresentedComponent ? (
                <ActionHeader
                  text={panelContainerProps.headerDataForPresentedComponent.title}
                  onClose={panelContainerProps.manager.closeDisclosure}
                  onBack={panelContainerProps.manager.disclosureComponentKeys.length > 1 ? panelContainerProps.manager.dismissPresentedComponent : undefined}
                  level={2}
                >
                  {panelContainerProps.headerDataForPresentedComponent.collapsibleMenuView}
                </ActionHeader>
              ) : undefined}
              {panelContainerProps.disclosureAccessory}
            </React.Fragment>
          )}
        >
          <SlideGroup slideAriaLabel={panelContainerProps.panelAriaRegionMessage} items={panelContainerProps.manager.disclosure.components} isAnimated handleFocus={handleFocus} />
        </ContentContainer>
      </span>
    );
  });

  const renderSlidePanel = (manager) => {
    const {
      children, disclosureAccessory, withDisclosureContainer, panelAriaLabel, mainAriaLabel, ...customProps
    } = props;

    let isFullscreen;
    if (manager.disclosure.size === availableDisclosureSizes.FULLSCREEN || manager.disclosure.isMaximized) {
      isFullscreen = true;
    }

    let panelSize;
    if (manager.disclosure.dimensions) {
      panelSize = disclosureDimensionsToPanelSize(manager.disclosure.dimensions);
    } else {
      panelSize = disclosureSizeToPanelSize[manager.disclosure.size];
    }

    const panelBehavior = manager?.disclosure?.typeConfig?.panelBehavior ? manager.disclosure.typeConfig.panelBehavior : customProps.panelBehavior;

    const presentedDisclosureComponentKey = manager.disclosureComponentKeys[manager.disclosureComponentKeys.length - 1];
    const presentedDisclosureComponentData = manager.disclosureComponentData[presentedDisclosureComponentKey] || {};
    const headerDataForPresentedComponent = presentedDisclosureComponentData.headerAdapterData;

    let panelAriaRegionMessage;
    if (headerDataForPresentedComponent && headerDataForPresentedComponent.title) {
      panelAriaRegionMessage = headerDataForPresentedComponent.title;
    } else if (panelAriaLabel) {
      panelAriaRegionMessage = panelAriaLabel;
    } else {
      panelAriaRegionMessage = 'Default panel aria label';
    }

    return (
      <SlidePanel
        {...customProps}
        fill
        panelBehavior={panelBehavior}
        isFullscreen={isFullscreen}
        panelSize={panelSize}
        isOpen={manager.disclosure.isOpen}
        panelContent={(
          <PanelContainer
            ref={panelRef}
            headerDataForPresentedComponent={headerDataForPresentedComponent}
            manager={manager}
            disclosureAccessory={disclosureAccessory}
            panelAriaRegionMessage={panelAriaRegionMessage}
          />
          // <ContentContainer
          //   fill
          //   header={(
          //     <React.Fragment>
          //       {headerDataForPresentedComponent ? (
          //         <ActionHeader
          //           text={headerDataForPresentedComponent.title}
          //           onClose={manager.closeDisclosure}
          //           onBack={manager.disclosureComponentKeys.length > 1 ? manager.dismissPresentedComponent : undefined}
          //           level={2}
          //         >
          //           {headerDataForPresentedComponent.collapsibleMenuView}
          //         </ActionHeader>
          //       ) : undefined}
          //       {disclosureAccessory}
          //     </React.Fragment>
          //   )}
          // >
          //   <SlideGroup slideAriaLabel={panelAriaRegionMessage} items={manager.disclosure.components} isAnimated />
          // </ContentContainer>
        )}
        panelAriaLabel={panelAriaRegionMessage}
        mainAriaLabel={mainAriaLabel}
        mainContent={manager.children.components}
      />
    );
  };

  console.log(panelRef);

  return (
    <DisclosureManager
      withDisclosureContainer={props.withDisclosureContainer}
      supportedDisclosureTypes={[disclosureType]}
      render={renderSlidePanel}
    >
      {props.children}
    </DisclosureManager>
  );
}

SlidePanelManager.propTypes = propTypes;
SlidePanelManager.defaultProps = defaultProps;

export default SlidePanelManager;
