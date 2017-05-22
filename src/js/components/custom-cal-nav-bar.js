import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { fetchSlotsForResource } from 'src/js/actions/staff';
import { TRANSITIONS } from 'src/js/constants';
import StaffCalendar from './staff-calendar';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, dispatch, navigationController, id }
    ) => {
    const monthNavHandler = (startOfMonth, navType) => () => {
        const startDate = moment(startOfMonth);
        dispatch(fetchSlotsForResource(startDate, id)).then(() => {
            navigationController.pushView(<StaffCalendar month={startDate} />, {
                transition: navType === 'next' ? TRANSITIONS.PUSH_LEFT : TRANSITIONS.PUSH_RIGHT
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
