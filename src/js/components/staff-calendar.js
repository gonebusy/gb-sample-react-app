import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectDate } from 'src/js/actions/staff';
import { getYYYYMMDDPath } from 'src/js/utils/date';
import CustomCalNavBar from './custom-cal-nav-bar';


export const StaffCalendar = (
        { availableSlots, dispatch, dayPickerMonth, router, id, style }
    ) => {
    const targetMonth = availableSlots ? moment.utc(Object.keys(availableSlots)[0]) : moment.utc();
    const handleDayClick = (day) => {
        const selectedDay = moment.utc(day);
        selectDate(selectedDay)(dispatch).then(() => {
            router.push(
                `/staff/${id}/available_slots/${getYYYYMMDDPath(selectedDay)}/start`
            );
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
      <div className="staff-calendar" style={style}>
        <div className="staff-calendar-picker">
          <DayPicker
              onDayClick={handleDayClick}
              weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              month={dayPickerMonth}
              disabledDays={getDisabledDates()}
              navbarElement={
                <CustomCalNavBar
                    router={router}
                    id={id}
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
    dayPickerMonth: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
};

export const mapStateToProps = (
        { staff: { selectedStaffMember: { id, availableSlots, dayPickerMonth } } }
    ) => ({
        availableSlots,
        dayPickerMonth,
        id
    });

export default connect(mapStateToProps)(StaffCalendar);

