import dateFormat from 'dateformat';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Slot } from './slot';
import {
    TIME_SLOT_SELECTED
} from 'src/js/action-types';

export const StaffSlots = (
        { date, slots, slotForm, router, dispatch }
    ) => {
    const formattedDate = dateFormat(date, 'dddd, d mmm yyyy');

    const timeClick = time => () => {
        dispatch(
            {
                type: TIME_SLOT_SELECTED,
                slotTime: time,
                slotType: slotForm === 'start' ? 'startTime' : 'endTime'
            }
        );
        if (slotForm !== 'start')
            router.push('/book');
    };
    return (
      <div className="staff-slots">
        <div className="staff-slots-date">{formattedDate}</div>
        {
            slots.length ?
              <div>
                <p className="staff-slots-message">{ `Choose your ${slotForm} time`}</p>
                <ul className="staff-slots-times">
                  {
                      slots.map((time, index) => (
                        <Slot
                            time={time}
                            key={`slot ${time}`}
                            index={index}
                            timeClick={timeClick}
                        />
                      ))
                  }
                </ul>
              </div>
              :
              <p className="staff-slots-message">No slots available!</p>
        }
      </div>
    );
};

StaffSlots.defaultProps = {
    startTime: '',
    duration: 0
};

StaffSlots.propTypes = {
    date: PropTypes.object.isRequired,
    slots: PropTypes.array.isRequired,
    slotForm: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};


const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                selectedDate, slotsForDate, slotForm
            },
            duration
        }
    }) => ({
        date: selectedDate,
        slots: slotsForDate,
        duration,
        slotForm
    });

export default connect(mapStateToProps)(StaffSlots);
