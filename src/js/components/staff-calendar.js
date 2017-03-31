import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDate } from 'src/js/actions/staff';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffSlots from './staff-slots';

export const StaffCalendar = (
        { imagePath, name, availableSlots, navigationController, dispatch }
    ) => {
    const handleDayClick = (day) => {
        const selectedDate = moment.utc(day);
        selectDate(selectedDate)(dispatch).then(() => {
            navigationController.pushView(<StaffSlots
                imagePath={imagePath}
                name={name} date={selectedDate}
                navigationController={navigationController}
            />);
        });
    };

    const goBack = () => {
        navigationController.popView();
    };

    const getDisabledDates = () => {
        let daysInMonth = moment.utc().daysInMonth();
        let currentDate = moment.utc().endOf('month');
        const disabledDates = [];
        while (daysInMonth) {
            if (!availableSlots[currentDate.format('YYYY-MM-DD')])
                disabledDates.push(currentDate.toDate());
            currentDate = currentDate.subtract(1, 'days');
            daysInMonth -= 1;
        }
        return disabledDates;
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
              disabledDays={getDisabledDates()}
          />
        </div>
      </div>
    );
};

StaffCalendar.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    availableSlots: PropTypes.object.isRequired
};

export const mapStateToProps = (
        { staff: { selectedStaffMember: { imagePath, name, availableSlots } } }
    ) => ({
        imagePath, name, availableSlots
    });

export default connect(mapStateToProps)(StaffCalendar);

