import React, { PropTypes } from 'react';
import { RouteTransition } from 'react-router-transition';
import { slideLeft, slideRight } from 'src/js/utils/transition-fixtures';
import { PUSH } from 'src/js/constants';

const Slide = ({ children, location }) => {
    const slide = location.action === PUSH ? slideLeft : slideRight;
    return (<RouteTransition
        component={false}
        className="transition-wrapper"
        pathname={location.pathname}
        {...slide}
    >
      {children}
    </RouteTransition>);
};

Slide.defaultProps = {
    children: undefined
};

Slide.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired
};

export default Slide;
