import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDate } from 'src/js/actions/staff';
import { CLEAR_SELECTED_STAFF_MEMBER } from 'src/js/action-types';
import Nav from './nav';
import StaffSlots from './staff-slots';
import CustomCalNavBar from './custom-cal-nav-bar';

export const StaffCalendar = (
        { availableSlots, navigationController, dispatch, month }
    ) => {
    const targetMonth = availableSlots ? moment.utc(Object.keys(availableSlots)[0]) : moment.utc();
    const handleDayClick = (day) => {
        const selectedDate = moment.utc(day);
        selectDate(selectedDate)(dispatch).then(() => {
            navigationController.pushView(<StaffSlots
                date={selectedDate}
                navigationController={navigationController}
            />);
        });
    };

    const goBack = () => {
        dispatch({ type: CLEAR_SELECTED_STAFF_MEMBER });
        navigationController.popView();
    };

    const getDisabledDates = () => {
        const disabledDates = [];
        let daysInMonth = targetMonth.daysInMonth();
        let currentDate = targetMonth.endOf('month');
        if (availableSlots)
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
        <Nav leftClick={() => goBack()} />

        <div className="staff-calendar-picker">
          <DayPicker
              onDayClick={handleDayClick}
              weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              month={month.toDate()}
              disabledDays={getDisabledDates()}
              navbarElement={
                <CustomCalNavBar
                    dispatch={dispatch}
                    navigationController={navigationController}
                />
              }
          />
        </div>
      </div>
    );
};

StaffCalendar.defaultProps = {
    month: moment.utc()
};

StaffCalendar.propTypes = {
    navigationController: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    availableSlots: PropTypes.object.isRequired,
    month: PropTypes.object
};

export const mapStateToProps = (
        { staff: { selectedStaffMember: { availableSlots } } }
    ) => ({
        availableSlots
    });

export default connect(mapStateToProps)(StaffCalendar);

