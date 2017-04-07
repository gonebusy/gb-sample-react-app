import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { fetchSlots, selectMonth } from 'src/js/actions/staff';
import StaffCalendar from './staff-calendar';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, dispatch, navigationController }
    ) => {
    const monthNavHandler = startOfMonth => () => {
        const startDate = moment(startOfMonth);
        dispatch(fetchSlots(startDate)).then(() => {
            dispatch(selectMonth(startDate.month())).then(() => {
                navigationController.pushView(<StaffCalendar month={startDate} />);
            });
        });
    };
    return (
      <div className={className} style={{ fontSize: '.75em' }}>
        <span
            className="DayPicker-NavButton DayPicker-NavButton--prev"
            onClick={monthNavHandler(previousMonth)}
        />
        <span
            className="DayPicker-NavButton DayPicker-NavButton--next"
            onClick={monthNavHandler(nextMonth)}
        />
      </div>
    );
};

CustomCalNavBar.propTypes = NavbarPropTypes;

export default CustomCalNavBar;
