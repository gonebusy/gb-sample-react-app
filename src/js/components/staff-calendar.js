import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { DATE_SELECTED } from 'src/js/action-types';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffSlots from './staff-slots';

export const StaffCalendar = ({ imagePath, name, navigationController, dispatch }) => {
    const handleDayClick = (day) => {
        const formattedDate = moment(day).format('YYYY-MM-DD');
        dispatch({ type: DATE_SELECTED, date: formattedDate });
        navigationController.pushView(<StaffSlots
            imagePath={imagePath}
            name={name} date={day}
            navigationController={navigationController}
        />);
    };

    const goBack = () => {
        navigationController.popView();
    };

    return (
      <div className="staff-calendar">
        <Nav leftClick={() => goBack()}>
          <StaffMember imagePath={imagePath} name={name} />
        </Nav>

        <div className="staff-calendar-picker">
          <DayPicker
              onDayClick={handleDayClick}
              weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
          />
        </div>
      </div>
    );
};

StaffCalendar.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export const mapStateToProps = ({ staff: { selectedStaffMember: { imagePath, name } } }) => ({
    imagePath, name
});

export default connect(mapStateToProps)(StaffCalendar);

