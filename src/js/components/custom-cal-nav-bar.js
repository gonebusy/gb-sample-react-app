import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { fetchSlotsForResource } from 'src/js/actions/staff';
import { TRANSITIONS } from 'src/js/constants';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, dispatch }
    ) => {
    const monthNavHandler = (startOfMonth, navType) => () => {
        const startDate = moment(startOfMonth);
        dispatch(fetchSlotsForResource(startDate, id));
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
