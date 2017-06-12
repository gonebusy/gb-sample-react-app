import React from 'react';
import { NavbarPropTypes } from 'react-day-picker';
import moment from 'moment';
import { getYYYYMMPath } from 'src/js/utils/date';

const CustomCalNavBar = (
        { nextMonth, previousMonth, className, id, router }
    ) => {
    const monthNavHandler = startOfMonth => () => {
        const startDate = moment(startOfMonth);
        router.push(`/staff/${id}/available_slots/${getYYYYMMPath(startDate)}`);
    };
    const goBackHandler = router.goBack;
    // only enable previous button for months that are after current month
    const enablePrevious = moment(previousMonth).isAfter(moment.utc().subtract(1, 'months'));
    return (
      <div className={className} style={{ fontSize: '.75em' }}>
        { enablePrevious &&
        <span
            className="DayPicker-NavButton DayPicker-NavButton--prev"
            onClick={goBackHandler}
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
