import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import StaffMember from './staff-member';

export const Nav = ({ imagePath, name, children, router, selectedDate }) => {
    const { pathname } = router.location;
    const goBack = () => {
        // This is to calculate how many months to go back
        // when navigating within the calendar
        // and going back to staff-picker.
        if (pathname.includes('available_slots') &&
            !(pathname.includes('start') || pathname.includes('end'))
        ) {
            const backCount = moment.utc().diff(selectedDate, 'months');
            router.go(backCount - 1);
        } else
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
    selectedDate: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name, selectedDate } } }
) => ({
    imagePath, name, selectedDate
});

export default connect(mapStateToProps)(Nav);
