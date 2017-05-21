import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CLEAR_SELECTED_STAFF_MEMBER } from 'src/js/action-types';
import StaffMember from './staff-member';

export const Nav = ({ imagePath, name, children, router, dispatch }) => {
    const { pathname } = router.location;
    const goBack = () => {
        if (pathname === '/calendar')
            dispatch({ type: CLEAR_SELECTED_STAFF_MEMBER });
        router.goBack();
    };
    const renderLink = (arrowOrientation) => {
        if (pathname !== '/')
            return (
              <a className={`nav-header--${arrowOrientation}`} onClick={goBack} />
            );

        return null;
    };

    const renderStaffMember = () => {
        if (name && imagePath)
            return <StaffMember imagePath={imagePath} name={name} />;
        return <p>Choose a staff member</p>;
    };


    return (
      <div>
        <div className="nav-header">
          <div className="nav-header--link">{renderLink('prev')}</div>
          <div className="nav-header--title">{renderStaffMember()}</div>
          <div className="nav-header--link" />
        </div>
        { children }
      </div>
    );
};

Nav.defaultProps = {
    children: undefined
};

Nav.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name }, views } }
) => ({
    imagePath, name, views
});

export default connect(mapStateToProps)(Nav);
