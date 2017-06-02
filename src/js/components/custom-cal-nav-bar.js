import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { fetchSlotsForResource } from 'src/js/actions/staff';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, dispatch, id }
    ) => {
    const monthNavHandler = startOfMonth => () => {
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
            onClick={monthNavHandler(previousMonth)}
        />
        }
        <span
            className="DayPicker-NavButton DayPicker-NavButton--next"
            onClick={monthNavHandler(nextMonth)}
        />
      </div>
    );
};

CustomCalNavBar.propTypes = NavbarPropTypes;

export default CustomCalNavBar;
