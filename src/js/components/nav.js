import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StaffMember from './staff-member';

export const Nav = ({ imagePath, name, children, router }) => {
    const { pathname } = router.location;
    const goBack = () => {
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
    router: PropTypes.object.isRequired
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name } } }
) => ({
    imagePath, name
});

export default connect(mapStateToProps)(Nav);
