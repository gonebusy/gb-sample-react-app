import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import request from 'superagent-bluebird-promise';

export const StaffForm = ({ startTime, endTime, date, id, router }) => {
    const confirmBooking = () => () => {
        const formattedDate = date.format('YYYY-MM-DD');
        const duration = moment(`${formattedDate} ${endTime}`, ['YYYY-MM-DD h:mm A']).diff(
                moment(`${formattedDate} ${startTime}`, ['YYYY-MM-DD h:mm A']), 'minutes');
        const body = {
            resourceId: id,
            date: formattedDate,
            time: startTime,
            duration
        };
        request.post('/api/bookings/new', body).then(() => {
            router.push('/confirm');
        });
    };

    return (
      <div className="staff-form">
        <div className="staff-slots-date">
          <p>{date.format('dddd, do MMM YYYY')}</p>
          <p>{startTime} - {endTime}</p>
        </div>

        <div className="staff-form__form">
          <div className="staff-form__form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" required="required" />
          </div>
          <div className="staff-form__form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" required="required" />
          </div>
          <button onClick={confirmBooking()} className="staff-form__confirm-btn">
              Confirm Booking
          </button>
        </div>

      </div>
    );
};

StaffForm.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired
};

const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                id, selectedDate, startTime, endTime
            }
        }
    }) => ({
        id,
        date: selectedDate,
        startTime,
        endTime
    });

export default connect(mapStateToProps)(StaffForm);
