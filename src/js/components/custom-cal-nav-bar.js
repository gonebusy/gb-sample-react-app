import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { fetchSlots, selectMonth } from 'src/js/actions/staff';
import StaffCalendar from './staff-calendar';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, dispatch, navigationController }
    ) => {
    const PUSH_LEFT = 1;
    const PUSH_RIGHT = 2;
    const monthNavHandler = (startOfMonth, navType) => () => {
        const startDate = moment(startOfMonth);
        dispatch(fetchSlots(startDate)).then(() => {
            dispatch(selectMonth(startDate.month())).then(() => {
                navigationController.pushView(<StaffCalendar month={startDate} />, {
                    transition: navType === 'next' ? PUSH_LEFT : PUSH_RIGHT
                });
            });
        });
    };
    // only enable previous button for months that are after current month
    const enablePrevious = moment(previousMonth).isAfter(moment.utc().subtract(1, 'months'));
    return (
      <div className={className} style={{ fontSize: '.75em' }}>
        { enablePrevious &&
        <span
            className="DayPicker-NavButton DayPicker-NavButton--prev"
            onClick={monthNavHandler(previousMonth, 'previous')}
        />
        }
        <span
            className="DayPicker-NavButton DayPicker-NavButton--next"
            onClick={monthNavHandler(nextMonth, 'next')}
        />
      </div>
    );
};

CustomCalNavBar.propTypes = NavbarPropTypes;

export default CustomCalNavBar;
