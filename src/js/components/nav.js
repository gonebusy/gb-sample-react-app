import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StaffMember from './staff-member';

export const Nav = ({ leftClick, rightClick, imagePath, name }) => {
    const renderLink = (arrowOrientation, click) => {
        if (click)
            return (
              <a className={`nav-header--${arrowOrientation}`} onClick={click} />
            );
        return null;
    };

    const renderStaffMember = () => {
        if (name && imagePath)
            return <StaffMember imagePath={imagePath} name={name} />;
        return <p>Choose a staff member</p>;
    };


    return (
      <div className="nav-header">
        <div className="nav-header--link">{renderLink('prev', leftClick)}</div>
        <div className="nav-header--title">{renderStaffMember()}</div>
        <div className="nav-header--link">{renderLink('next', rightClick)}</div>
      </div>
    );
};

Nav.defaultProps = {
    leftClick: undefined,
    rightClick: undefined,
    children: undefined
};

Nav.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    leftClick: PropTypes.func,
    rightClick: PropTypes.func
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name } } }
) => ({
    imagePath, name
});

export default connect(mapStateToProps)(Nav);
