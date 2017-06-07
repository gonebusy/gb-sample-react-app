import React, { PropTypes } from 'react';
import { RouteTransition } from 'react-router-transition';
import { slideLeft } from 'src/js/utils/transition-fixtures';

const SlideLeft = ({ children, location }) => (
  <RouteTransition
      component={false}
      className="transition-wrapper"
      pathname={location.pathname}
      {...slideLeft}
  >
    {children}
  </RouteTransition>
);

SlideLeft.defaultProps = {
    children: undefined
};

SlideLeft.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired
};

export default SlideLeft;
