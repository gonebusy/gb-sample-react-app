import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDate } from 'src/js/actions/staff';
import CustomCalNavBar from './custom-cal-nav-bar';

export const StaffCalendar = (
        { availableSlots, dispatch, month, router }
    ) => {
    const targetMonth = availableSlots ? moment.utc(Object.keys(availableSlots)[0]) : moment.utc();
    const handleDayClick = (day) => {
        const selectedDate = moment.utc(day);
        selectDate(selectedDate)(dispatch).then(() => {
            router.push('/available_slots');
        });
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
        <div className="staff-calendar-picker">
          <DayPicker
              onDayClick={handleDayClick}
              weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              month={month}
              disabledDays={getDisabledDates()}
              navbarElement={
                <CustomCalNavBar
                    dispatch={dispatch}
                />
              }
          />
        </div>
      </div>
    );
};

StaffCalendar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    availableSlots: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    month: PropTypes.object,
    id: PropTypes.number.isRequired
};

export const mapStateToProps = (
        { staff: { selectedStaffMember: { id, availableSlots, selectedMonth } } }
    ) => ({
        availableSlots,
        month: selectedMonth
        id
    });

export default connect(mapStateToProps)(StaffCalendar);

